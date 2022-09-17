#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use serde::Deserialize;
use bitflags::bitflags;
use integer_encoding::VarInt;
use base64::{encode, decode};
use num_derive::FromPrimitive;
use num_traits::FromPrimitive;

#[derive(Deserialize)]
struct ModConfig {
    info: ModInfo,
    general: GeneralConfig,
    floor_skills: FloorSkills
}

#[derive(Deserialize)]
struct ModInfo {
    name: String,
    description: String,
}

#[derive(Deserialize)]
struct GeneralConfig {
    spawns: SpawnType,
    curse_spawns: CurseSpawnType,
    options: u32,
    starting_skills: Vec<WeightedSkill>,
}

#[derive(Deserialize)]
struct FloorSkills {
    all_floors: RoomSkills,
    first_floor: RoomSkills,
    second_floor: RoomSkills,
    third_floor: RoomSkills,
    boss: RoomSkills,
}

#[derive(Deserialize)]
struct RoomSkills {
    all: Vec<WeightedSkill>,
    skill: Vec<WeightedSkill>,
    shop: Vec<WeightedSkill>,
    curse: Vec<WeightedSkill>,
    finale: Vec<WeightedSkill>,
}

#[derive(Deserialize)]
struct Configuration  {
    spawns: SpawnType,
    curse_spawns: CurseSpawnType,
    options: u32,
    starting_skill_ids: Vec<u32>,
}

#[derive(Debug)]
#[derive(Deserialize)]
struct WeightedSkill {
    id: u32,
    weight: u32,
}

#[derive(Debug)]
#[derive(Deserialize, Copy, Clone, FromPrimitive)]
enum SpawnType {
    None = 0, Looped = 1, Weighted = 2, Consecutive = 3
}

#[derive(Debug)]
#[derive(Deserialize, Copy, Clone, FromPrimitive)]
enum CurseSpawnType {
    None = 0, Randomly = 1, Always = 2, Never = 3
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
fn accept_config(config: Configuration) -> String {
    let config_string = encode_configuration(&config);
    let new_config = decode_configuration(&config_string);
    let options = Options::from_bits(new_config.options).unwrap();
    return format!(
        "Spawns: {:?}, \
         Curse spawns: {:?}, \
         Config per floor: {}, \
         Config per room: {}, \
         Remove healing items: {}, \
         Disable mentor abilties: {}, \
         Disable gift of the intern: {}, \
         Disabled pinned: {}, \
         Award skills per level: {}, \
         starting skill ids: {:?}, \
         config code: {:?}
        ", new_config.spawns, new_config.curse_spawns, options.contains(Options::CONFIG_PER_FLOOR),
         options.contains(Options::CONFIG_PER_ROOM), options.contains(Options::REMOVE_HEALING_ITEMS),
         options.contains(Options::DISABLE_MENTOR_ABILITIES), options.contains(Options::DISABLE_GIFT_OF_INTERN),
         options.contains(Options::DISABLE_PINNED), options.contains(Options::AWARD_SKILLS_PER_LEVEL),
         new_config.starting_skill_ids, config_string
    );
}

#[tauri::command]
fn get_config_code() -> String {
    // Return a dummy string for testing - This is not a valid code though
    return String::from("VGhpcyBpcyBhbiBleGFtcGxlIHNkZiBzZGtqZiBza2RmIA==");
}

#[tauri::command]
fn save_mod(mod_config: ModConfig) {
    println!("Received mod!");
}

fn encode_configuration(config: &Configuration) -> String {
    let config_array = build_array(&config);
    return u32_vec_to_string(config_array);
}

fn decode_configuration(config_string: &String) -> Configuration {
    let config_array = string_to_u32_vec(config_string);
    return build_config(config_array.unwrap());
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
fn string_to_u32_vec(config_string: &str) -> Result<Vec<u32>, String> {
    let mut decoded = decode(config_string).unwrap();

    let mut result: Vec<u32> = vec![];
    // Read u8 values as u32 varints
    while !decoded.is_empty() {
        let (read, size) = u32::decode_var(&decoded).ok_or("This should never happen, as it's coming from us.")?;
        result.push(read);
        decoded = decoded[size..].to_vec();
    }
    Ok(result)
}

fn build_config(config_array: Vec<u32>) ->  Configuration {
    return Configuration {
        spawns: FromPrimitive::from_u32(config_array[3]).unwrap(),
        curse_spawns: FromPrimitive::from_u32(config_array[4]).unwrap(),
        options: config_array[2],
        starting_skill_ids: config_array[7..].to_vec(),
    };
}

fn build_array(config: &Configuration) ->  Vec<u32> {
    // Generally, the format will read as
    // 0x0 Version Options Spawn Curse
    // Followed by the repeating config of
    // Floor Number StartingSkills / ShopSkills / PickupSkills / FinaleSkills 
    // Skill reps will have the number of skills followed by the ids
    let mut array = Vec::new();
    array.append(&mut vec![
        0,
        1,
        (config.options as u32),
        (config.spawns as u32),
        (config.curse_spawns as u32),
    ]);
    // This will eventually be replaced by proper looping of all floor configs
    array.push(0);

    array.push(config.starting_skill_ids.len() as u32);
    array.extend(&config.starting_skill_ids.clone());
    return array;
}

fn main() {
    let context = tauri::generate_context!();
    tauri::Builder::default()
        .menu(tauri::Menu::os_default(&context.package_info().name))
        .invoke_handler(tauri::generate_handler![accept_config])
        .invoke_handler(tauri::generate_handler![get_config_code])
        .invoke_handler(tauri::generate_handler![save_mod])
        .run(context)
        .expect("error while running tauri application");
}
