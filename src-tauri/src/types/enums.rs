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
    None = 0, Randomly = 1, Always = 2, Never = 3, AlwaysIfAble = 4,
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
    }
}