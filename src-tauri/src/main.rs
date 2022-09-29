#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod config_io;

use std::collections::HashMap;
use std::collections::VecDeque;

use config_io::{CornercutterConfig, is_valid_going_under_dir, CornercutterCache, create_cornercutter_folders, load_cornercutter_cache, serialize_mod, CornercutterCurrentMod, get_mod_filename, serialize_current_mod_config, delete_mod_file};
use serde::{Serialize, Deserialize};
use bitflags::bitflags;
use integer_encoding::VarInt;
use base64::{encode, decode};
use num_derive::FromPrimitive;
use num_traits::FromPrimitive;
use tauri::State;
use tauri::generate_context;
use uuid::Uuid;

use crate::config_io::serialize_cornercutter_config;

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all="camelCase")]
pub struct ModConfig {
    id: String,
    info: ModInfo,
    general: GeneralConfig,
    floor_skills: FloorSkills
}

#[derive(Serialize, Deserialize, Clone)]
struct ModInfo {
    name: String,
    description: String,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all="camelCase")]
struct GeneralConfig {
    spawns: SpawnType,
    curse_spawns: CurseSpawnType,
    options: u32,
    starting_skills: Vec<WeightedSkill>,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all="camelCase")]
struct FloorSkills {
    all_floors: RoomSkills,
    first_floor: RoomSkills,
    second_floor: RoomSkills,
    third_floor: RoomSkills,
    boss: RoomSkills,
}

#[derive(Serialize, Deserialize, Clone)]
struct RoomSkills {
    all: Vec<WeightedSkill>,
    free: Vec<WeightedSkill>,
    shop: Vec<WeightedSkill>,
    curse: Vec<WeightedSkill>,
    finale: Vec<WeightedSkill>,
}

#[derive(Debug)]
#[derive(Serialize, Deserialize, Copy, Clone)]
struct WeightedSkill {
    id: u32,
    weight: u32,
}

#[derive(Debug)]
#[derive(Serialize, Deserialize, Copy, Clone, FromPrimitive, PartialEq)]
enum SpawnType {
    None = 0, Looped = 1, Weighted = 2, Consecutive = 3
}

#[derive(Debug)]
#[derive(Serialize, Deserialize, Copy, Clone, FromPrimitive)]
enum CurseSpawnType {
    None = 0, Randomly = 1, Always = 2, Never = 3, AlwaysIfAble = 4,
}

bitflags! {
    struct Options: u32 {
        const NONE_SELECTED = 0;
        const CONFIG_PER_FLOOR = 1 << 0;
        const CONFIG_PER_ROOM = 1 << 1;
        const REMOVE_HEALING_ITEMS = 1 << 2;
        const DISABLE_MENTOR_ABILITIES = 1 << 3;
        const DISABLE_GIFT_OF_INTERN = 1 << 4;
        const DISABLE_PINNED = 1 << 5;
        const AWARD_SKILLS_PER_LEVEL = 1 << 6;
    }
}

#[tauri::command]
fn get_config_code(mod_config: ModConfig) -> String {
    let mut config_code = String::new();
    
    config_code.push_str("# ");
    config_code.push_str(mod_config.info.name.as_str());
    config_code.push_str("\n# ");
    config_code.push_str(mod_config.info.description.as_str());
    config_code.push('\n');
    config_code.push_str(encode_mod_config(&mod_config).as_str());

    println!("{}", encode_mod_config(&mod_config).as_str());
    println!("{}", encode_mod_config(&decode_configuration(&encode_mod_config(&mod_config)).unwrap()).as_str());

    return config_code;
}

#[tauri::command]
fn get_current_mod(cache: State<CornercutterCache>) -> CornercutterCurrentMod {
    return cache.current_mod.lock().unwrap().clone();
}

#[tauri::command]
fn get_cornercutter_config(cache: State<CornercutterCache>) -> CornercutterConfig {
    let config = cache.config.lock().unwrap();
    return config.clone();
}

#[tauri::command]
fn get_mods(cache: State<CornercutterCache>) -> Vec<ModConfig> {
    let mods = cache.mods.lock()
        .unwrap()
        .values()
        .map(|mod_config| mod_config.clone())
        .collect();
    return mods;
}

#[tauri::command]
fn set_going_under_dir(cache: State<CornercutterCache>, dir: String) -> bool {
    let mut config = cache.config.lock().unwrap();

    if is_valid_going_under_dir(dir.as_str()) {
        config.going_under_dir = Some(dir);
        config.set_directory = true;
        serialize_cornercutter_config(&config);
        create_cornercutter_folders(&config);
        return true;
    }
    return false;
}

#[tauri::command]
fn delete_mod(cache: State<CornercutterCache>, mod_id: String) {
    let mut mods = cache.mods.lock().unwrap();
    if mods.contains_key(&mod_id) {
        let mod_config = mods.remove(&mod_id).unwrap();
        delete_mod_file(&cache.config.lock().unwrap(), &mod_config);
    }
}

#[tauri::command]
fn save_mod(cache: State<CornercutterCache>, mod_config: ModConfig) {
    serialize_mod(&cache.config.lock().unwrap(), &mod_config);
    cache.mods.lock().unwrap().insert(mod_config.id.clone(), mod_config);
}

#[tauri::command]
fn import_mod(cache: State<CornercutterCache>, config_string: String) -> Result<ModConfig, String> {
    let config = cache.config.lock().unwrap();
    let id = get_new_id(&cache.mods.lock().unwrap());

    let res = match decode_configuration(&config_string) {
        Err(err) => Err(err),
        Ok(mod_config) => {
            serialize_mod(&config, &mod_config);
            cache.mods.lock().unwrap().insert(id, mod_config.clone());
            Ok(mod_config)
        },
    };
    
    return res;
}

#[tauri::command]
fn get_new_mod_id(cache: State<CornercutterCache>) -> String {
    return get_new_id(&cache.mods.lock().unwrap());
}

#[tauri::command]
fn set_enabled_mod(cache: State<CornercutterCache>, enabled_mod: Option<String>) {
    let config = cache.config.lock().unwrap();

    cache.current_mod.lock().unwrap().current_mod = enabled_mod.map(|id| get_mod_filename(id));
    serialize_current_mod_config(&config, &cache.current_mod.lock().unwrap())
}

fn generate_room_skills() -> RoomSkills{
    return RoomSkills {
        all: Vec::new(),
        free: Vec::new(),
        shop: Vec::new(),
        curse: Vec::new(),
        finale: Vec::new(),
    }
}

fn get_new_id(map: &HashMap<String, ModConfig>) -> String {
    let mut uuid = Uuid::new_v4().to_string();

    while map.contains_key(&uuid) {
        uuid = Uuid::new_v4().to_string();
    }

    return uuid;
}

fn decode_configuration(config_string: &String) -> Result<ModConfig, String> {
    let split = config_string.lines().collect::<Vec<&str>>();
    let name: String;
    let config_string: String;
    let mut description= String::from("");

    if split.len() == 1 {
        name = String::from("Imported mod");
        config_string = split[0].trim().to_string();
    } else if split.len() == 2 {
        name = get_commented_string(split[0])?;
        config_string = split[1].trim().to_string();
    } else if split.len() == 3 {
        name = get_commented_string(split[0])?;
        description = get_commented_string(split[1])?;
        config_string = split[2].trim().to_string();
    } else {
        // Too many lines, error out
        return Err("Too many lines in config string".to_string())
    }

    let info = ModInfo{name: name.to_string(), description: description.to_string()};
    let mut config_array = string_to_u32_vec(&config_string)?;
    return build_mod_config(&info, &mut config_array);
}

fn get_commented_string(original_string: &str) -> Result<String, String> {
    if !original_string.starts_with("#") {
        return Err("Not a valid comment string".to_string())
    }
    let result = original_string[1..original_string.len()].trim().to_string();
    Ok(result)
}

fn encode_mod_config(config: &ModConfig) -> String {
    let config_array = build_mod_array(&config);
    return u32_vec_to_string(config_array);
}

// Uses the same logic as https://github.com/arranf/deck-codes/blob/master/src/lib.rs
fn u32_vec_to_string(byte_array: Vec<u32>) -> String {
    let mut fixed_size_integers: Vec<u8> = Vec::new();
    // This is calculated by taking the largest dbfid and calculating ceil(log(dbfid, 128)) as 128 is the largest value a u8 can store.
    let mut encoded: [u8; 4] = [0, 0, 0, 0];
    for i in byte_array {
        let encoded_bytes = i.encode_var(&mut encoded[..]);
        for encoded_index in 0..encoded_bytes {
            fixed_size_integers.push(encoded[encoded_index]);
        }
    }
    return encode(&fixed_size_integers);
}

// Modified version of the decode from lib.rs
fn string_to_u32_vec(config_string: &str) -> Result<VecDeque<u32>, String> {
    let mut decoded = decode(config_string).unwrap();

    let mut result: VecDeque<u32> = VecDeque::new();
    // Read u8 values as u32 varints
    while !decoded.is_empty() {
        let (read, size) = u32::decode_var(&decoded).ok_or("Invalid varint encountered")?;
        result.push_back(read);
        decoded = decoded[size..].to_vec();
    }
    Ok(result)
}

fn build_mod_config(mod_info: &ModInfo,  config_array_original: &VecDeque<u32>) -> Result<ModConfig, String> {
    let mut config_array = config_array_original.clone();
    config_array.pop_front();
    let major = config_array.pop_front().unwrap();
    let minor = config_array.pop_front().unwrap();
    let patch = config_array.pop_front().unwrap();
    let options = config_array.pop_front().unwrap();
    let spawns = FromPrimitive::from_u32(config_array.pop_front().unwrap()).unwrap();
    let curse_spawns = FromPrimitive::from_u32(config_array.pop_front().unwrap()).unwrap();
    let mut num_skills = config_array.pop_front().unwrap();
    let is_weighted = spawns == SpawnType::Weighted;
    let starting_skills = build_skill(&mut config_array, num_skills, is_weighted);

    let option_flags = Options::from_bits(options).unwrap();
    let per_room = option_flags.contains(Options::CONFIG_PER_ROOM);

    let mut floors: Vec<RoomSkills> = vec![generate_room_skills(); 5];

    while config_array.len() != 0 {
        let floor = config_array.pop_front().unwrap();
        let mut all: Vec<WeightedSkill>  = Vec::new();
        let mut free: Vec<WeightedSkill> = Vec::new();
        let mut shop: Vec<WeightedSkill> = Vec::new();
        let mut curse: Vec<WeightedSkill> = Vec::new();
        let mut finale: Vec<WeightedSkill> = Vec::new();
        let mut room_skills: Vec<WeightedSkill>;

        if per_room {
            num_skills = config_array.pop_front().unwrap();
            room_skills = build_skill(&mut config_array, num_skills, is_weighted);
            free.append(&mut room_skills);

            num_skills = config_array.pop_front().unwrap();
            room_skills = build_skill(&mut config_array, num_skills, is_weighted);
            shop.append(&mut room_skills);

            num_skills = config_array.pop_front().unwrap();
            room_skills = build_skill(&mut config_array, num_skills, is_weighted);
            curse.append(&mut room_skills);

            num_skills = config_array.pop_front().unwrap();
            room_skills = build_skill(&mut config_array, num_skills, is_weighted);
            finale.append(&mut room_skills);
        } else {
            num_skills = config_array.pop_front().unwrap();
            room_skills = build_skill(&mut config_array, num_skills, is_weighted);
            all.append(&mut room_skills);
        }

        let room_skills = RoomSkills{
            all, free, shop, curse, finale
        };

        floors[floor as usize] = room_skills;
    }

    let floor_skills = FloorSkills {
        all_floors: floors[0].clone(),
        first_floor: floors[1].clone(),
        second_floor: floors[2].clone(),
        third_floor: floors[3].clone(),
        boss: floors[4].clone(),
    };

    let general_config = GeneralConfig {
        spawns,
        curse_spawns,
        options,
        starting_skills: starting_skills.to_vec()
    };

    let mod_config = ModConfig {
        id: "Imported mod".to_string(),
        info: mod_info.clone(),
        general: general_config,
        floor_skills
    };

    Ok(mod_config)
}

fn build_mod_array(config: &ModConfig) ->  Vec<u32> {
    // Generally, the format will read as
    // 0x0 Version Options Spawn Curse StartingSkills
    // Followed by the repeating config of
    // Floor Number PickupSkills / ShopSkills / CurseSkills / FinaleSkills 
    // Skill reps will have the number of skills followed by the ids
    let mut array = Vec::new();
    array.append(&mut vec![
        0,
        1, 0, 0,
        (config.general.options as u32),
        (config.general.spawns as u32),
        (config.general.curse_spawns as u32),
    ]);
    array.push(config.general.starting_skills.len() as u32);
    let is_weighted = config.general.spawns == SpawnType::Weighted;
    for skill in config.general.starting_skills.iter() {
        array.push(skill.id);
        if is_weighted {
            array.push(skill.weight);
        }
    }
    let options = Options::from_bits(config.general.options).unwrap();
    let per_floor = options.contains(Options::CONFIG_PER_FLOOR);
    let per_room = options.contains(Options::CONFIG_PER_ROOM);  
    if per_floor {
        array.extend(build_room_skills_array(1, &config.floor_skills.first_floor, per_room, is_weighted).clone());
        array.extend(build_room_skills_array(2, &config.floor_skills.second_floor, per_room, is_weighted).clone());
        array.extend(build_room_skills_array(3, &config.floor_skills.third_floor,  per_room, is_weighted).clone());
        array.extend( build_room_skills_array(4, &config.floor_skills.boss, per_room, is_weighted).clone());
    } else {
        array.extend(build_room_skills_array(0, &config.floor_skills.all_floors, per_room, is_weighted).clone());
    }
    return array;
}

fn build_room_skills_array(floor_id: u32, room_skills: &RoomSkills, per_room: bool, is_weighted: bool) -> Vec<u32> {
    let mut array = Vec::new();
    let total_skills = if per_room {
        room_skills.free.len() + room_skills.shop.len() + room_skills.curse.len() + room_skills.finale.len()
    } else {
        room_skills.all.len()
    };

    if total_skills == 0 {
        return array
    } else {
        array.push(floor_id);
    }

    if per_room {
        array.push(room_skills.free.len() as u32);
        array.extend(build_skill_array(&room_skills.free, is_weighted).clone());
        array.push(room_skills.shop.len() as u32);
        array.extend(build_skill_array(&room_skills.shop, is_weighted).clone());
        array.push(room_skills.curse.len() as u32);
        array.extend(build_skill_array(&room_skills.curse, is_weighted).clone());
        array.push(room_skills.finale.len() as u32);
        array.extend(build_skill_array(&room_skills.finale, is_weighted).clone());
    } else {
        array.push(room_skills.all.len() as u32);
        array.extend(build_skill_array(&room_skills.all, is_weighted).clone());
    }
    return array;
}

fn build_skill_array(skills_list: &Vec<WeightedSkill>, is_weighted: bool) -> Vec<u32> {
    let mut array = Vec::new();
    for skill in skills_list.iter() {
        array.push(skill.id);
        if is_weighted {
            array.push(skill.weight);
        }
    }
    return array;
}

fn build_skill(source: &mut VecDeque<u32>, num_skills: u32, is_weighted: bool) -> Vec<WeightedSkill> {
    let mut skills: Vec<WeightedSkill> = Vec::new();
    for x in 0..num_skills {
        let id = source.pop_front().unwrap();
        let weight;
        if is_weighted {
            weight = source.pop_front().unwrap();
        } else {
            weight = 10;
        }
        skills.push(WeightedSkill{id, weight});
    }
    return skills;
}

fn main() {
    let context = tauri::generate_context!();
    tauri::Builder::default()
        .manage(load_cornercutter_cache())
        .invoke_handler(tauri::generate_handler![
            get_config_code, 
            get_cornercutter_config, 
            get_current_mod,
            delete_mod,
            save_mod, 
            set_going_under_dir, 
            get_mods,
            import_mod,
            get_new_mod_id,
            set_enabled_mod
        ])
        .run(context)
        .expect("error while running tauri application");
}
