import { WeightedSkill } from './Skill';

export default interface ModConfig {
    id: string;
    info: ModInfo;
    general: GeneralConfig;
    floorSkills: FloorSkills;
}

export interface ModInfo {
    name: string;
    description: string;
}

export interface GeneralConfig {
    spawns: SpawnType;
    curseSpawns: CurseSpawnType;
    options: Options;
    startingSkills: WeightedSkill[];
}

export type FloorSkills = Record<Floor, Record<Room, WeightedSkill[]>>;

export enum SpawnType {
    Looped = 'Looped',
    Weighted = 'Weighted',
    Consecutive = 'Consecutive',
}

export enum CurseSpawnType {
    Randomly = 'Randomly',
    Always = 'Always',
    Never = 'Never',
    AlwaysIfAble = 'AlwaysIfAble',
}

export enum Floor {
    AllFloors = 'allFloors',
    FirstFloor = 'firstFloor',
    SecondFloor = 'secondFloor',
    ThirdFloor = 'thirdFloor',
    Boss = 'boss',
}

export enum Room {
    All = 'all',
    Free = 'free',
    Shop = 'shop',
    Curse = 'curse',
    Finale = 'finale',
}

export enum Options {
    NoneSelected = 0,
    ConfigPerFloor = 1 << 0,
    ConfigPerRoom = 1 << 1,
    RemoveHealingItems = 1 << 2,
    DisableMentorAbilities = 1 << 3,
    DisableGiftOfIntern = 1 << 4,
    DisablePinned = 1 << 5,
    AwardSkillsPerFloor = 1 << 6,
}

export const DEFAULT_CONFIG: GeneralConfig = {
    spawns: SpawnType.Looped,
    curseSpawns: CurseSpawnType.Randomly,
    options: Options.RemoveHealingItems | Options.DisablePinned,
    startingSkills: [],
};
