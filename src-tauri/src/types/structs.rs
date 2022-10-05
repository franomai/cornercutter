use serde::{Serialize, Deserialize};

use crate::types::enums::{
    SpawnType,
    CurseSpawnType,
    PedestalSpawnType,
    MultiSpawnerType
};

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all="camelCase")]
pub struct ModConfig {
    pub id: String,
    pub info: ModInfo,
    pub general: GeneralConfig,
    pub floor_skills: FloorSkills
}

#[derive(Serialize, Deserialize, Clone)]
pub struct ModInfo {
    pub name: String,
    pub description: String,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all="camelCase")]
pub struct GeneralConfig {
    pub spawns: SpawnType,
    pub curse_spawns: CurseSpawnType,
    pub pedestal_spawns: PedestalSpawnType,
    pub multi_spawners: MultiSpawnerType,
    pub options: u32,
    pub starting_skills: Vec<WeightedSkill>,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all="camelCase")]
pub struct FloorSkills {
    pub all_floors: RoomSkills,
    pub first_floor: RoomSkills,
    pub second_floor: RoomSkills,
    pub third_floor: RoomSkills,
    pub boss: RoomSkills,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct RoomSkills {
    pub all: Vec<WeightedSkill>,
    pub free: Vec<WeightedSkill>,
    pub shop: Vec<WeightedSkill>,
    pub curse: Vec<WeightedSkill>,
    pub finale: Vec<WeightedSkill>,
}

#[derive(Debug)]
#[derive(Serialize, Deserialize, Copy, Clone)]
pub struct WeightedSkill {
    pub id: u32,
    pub weight: u32,
}