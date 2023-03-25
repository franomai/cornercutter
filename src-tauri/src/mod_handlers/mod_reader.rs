use std::collections::VecDeque;

use num_traits::FromPrimitive;

use crate::types::structs::{
    ModConfig,
    ModInfo,
    GeneralConfig,
    FloorSkills,
    RoomSkills,
    WeightedSkill
};

use crate::types::enums::{
    SpawnType,
    CurseSpawnType,
    PedestalSpawnType,
    MultiSpawnerType,
    Options, 
};

use crate::mod_handlers::mod_util::{
    string_to_u32_vec,
    get_commented_string,
    generate_empty_room_skills,
};

pub fn decode_configuration(config_string: &String, id: &String) -> Result<ModConfig, String> {
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
    return build_mod_config(&info, &mut config_array, &id);
}

fn build_mod_config(mod_info: &ModInfo,  config_array_original: &VecDeque<u32>, id: &String) -> Result<ModConfig, String> {
    let mut config_array = config_array_original.clone();
    config_array.pop_front();
    let _major = config_array.pop_front().unwrap();
    let _minor = config_array.pop_front().unwrap();
    let _patch = config_array.pop_front().unwrap();
    let options = config_array.pop_front().unwrap();
    let spawns: SpawnType = FromPrimitive::from_u32(config_array.pop_front().unwrap()).unwrap();
    let curse_spawns: CurseSpawnType = FromPrimitive::from_u32(config_array.pop_front().unwrap()).unwrap();
    let pedestal_spawns: PedestalSpawnType = FromPrimitive::from_u32(config_array.pop_front().unwrap()).unwrap();
    let multi_spawners: MultiSpawnerType = FromPrimitive::from_u32(config_array.pop_front().unwrap()).unwrap();
    let mut num_skills = config_array.pop_front().unwrap();
    let is_weighted = spawns == SpawnType::Weighted;
    let starting_skills = build_skill(&mut config_array, num_skills, is_weighted);

    let option_flags = Options::from_bits(options).unwrap();
    let per_room = option_flags.contains(Options::CONFIG_PER_ROOM);

    let mut floors: Vec<RoomSkills> = vec![generate_empty_room_skills(); 5];

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
        pedestal_spawns,
        multi_spawners,
        options,
        starting_skills: starting_skills.to_vec()
    };

    let mod_config = ModConfig {
        id: id.clone(),
        info: mod_info.clone(),
        general: general_config,
        floor_skills
    };

    Ok(mod_config)
}

fn build_skill(source: &mut VecDeque<u32>, num_skills: u32, is_weighted: bool) -> Vec<WeightedSkill> {
    let mut skills: Vec<WeightedSkill> = Vec::new();
    for _ in 0..num_skills {
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