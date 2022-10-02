use crate::types::structs::{
    ModConfig,
    RoomSkills,
    WeightedSkill
};

use crate::types::enums::{
    SpawnType,
    Options, 
};

use crate::mod_handlers::mod_util::u32_vec_to_string;

pub fn encode_configuration(mod_config: ModConfig) -> String {
    let mut config_code = String::new();
    
    config_code.push_str("# ");
    config_code.push_str(mod_config.info.name.as_str());
    config_code.push_str("\n# ");
    config_code.push_str(mod_config.info.description.as_str());
    config_code.push('\n');
    config_code.push_str(encode_mod_config(&mod_config).as_str());

    return config_code;
}

fn encode_mod_config(config: &ModConfig) -> String {
    let config_array = build_mod_array(&config);
    return u32_vec_to_string(config_array);
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

