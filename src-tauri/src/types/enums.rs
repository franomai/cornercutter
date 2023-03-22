use serde::{Serialize, Deserialize};
use num_derive::FromPrimitive;
use bitflags::bitflags;

#[derive(Debug)]
#[derive(Serialize, Deserialize, Copy, Clone, FromPrimitive, PartialEq)]
pub enum SpawnType {
    None = 0, Looped = 1, Weighted = 2, Consecutive = 3
}

#[derive(Debug)]
#[derive(Serialize, Deserialize, Copy, Clone, FromPrimitive)]
pub enum CurseSpawnType {
    None = 0, Randomly = 1, Always = 2, AlwaysIfAble = 3, Never = 4, 
}

#[derive(Debug)]
#[derive(Serialize, Deserialize, Copy, Clone, FromPrimitive)]
pub enum PedestalSpawnType {
    None = 0, Randomly = 1, AlwaysFirstFloor = 2, AlwaysLastFloor = 3, Never = 4,
}

#[derive(Debug)]
#[derive(Serialize, Deserialize, Copy, Clone, FromPrimitive)]
pub enum MultiSpawnerType {
    None = 0, Randomly = 1, AlwaysSkillIfAble = 2, Never = 3
}

bitflags! {
    pub struct Options: u32 {
        const NONE_SELECTED = 0;
        const CONFIG_PER_FLOOR = 1 << 0;
        const CONFIG_PER_ROOM = 1 << 1;
        const REMOVE_HEALING_ITEMS = 1 << 2;
        const DISABLE_MENTOR_ABILITIES = 1 << 3;
        const DISABLE_GIFT_OF_INTERN = 1 << 4;
        const DISABLE_PINNED = 1 << 5;
        const AWARD_SKILLS_PER_LEVEL = 1 << 6;
        const DISABLE_HEALING = 1 << 7;
        const DISABLE_ITEM_PICKUP = 1 << 8;
    }
}

bitflags! {
    pub struct GlobalOptions: u32 {
        const NONE_SELECTED = 0;
        const DISABLE_CORNERCUTTER = 1 << 0;
        const DISABLE_HIGHSCORES = 1 << 1;
        const DISABLE_STEAM_ACHIEVEMENTS = 1 << 2;
        const RESPECT_UNLOCKS = 1 << 3;
        const ENABLE_DEBUG_MENU = 1 << 4;
        const ENABLE_EXTRA_LOGGING = 1 << 5;
        const ENSURE_ALWAYS_FIVE_CUBIT_SHOP_OPTIONS = 1 << 6;
        const ENABLE_FREE_CUBIT_SHOP = 1 << 7;
        const UNLOCK_ALL_COSTUMES = 1 << 8;
    }
}