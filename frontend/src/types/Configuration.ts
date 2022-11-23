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
    pedestalSpawns: PedestalSpawnType;
    multiSpawners: MultiSpawnerType;
    options: ModOptions;
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

export enum PedestalSpawnType {
    Randomly = 'Randomly',
    AlwaysFirstFloor = 'AlwaysFirstFloor',
    AlwaysLastFloor = 'AlwaysLastFloor',
    Never = 'Never',
}

export enum MultiSpawnerType {
    Randomly = 'Randomly',
    AlwaysSkillIfAble = 'AlwaysSkillIfAble',
    Never = 'Never',
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

export type Options = number & (ModOptions | GlobalOptions);

export enum ModOptions {
    NoneSelected = 0,
    ConfigPerFloor = 1 << 0,
    ConfigPerRoom = 1 << 1,
    SelectRandomItemOnEmpty = 1 << 2,
    DisableMentorAbilities = 1 << 3,
    DisableGiftOfIntern = 1 << 4,
    DisablePinned = 1 << 5,
    AwardSkillsPerFloor = 1 << 6,
}

export enum GlobalOptions {
    NoneSelected = 0,
    DisableCornercutter = 1 << 0,
    DisableHighscores = 1 << 1,
    DisableSteamAchievements = 1 << 2,
    RespectUnlocks = 1 << 3,
    EnableDebugMenu = 1 << 4,
    EnableExtraLogging = 1 << 5,
}

export const DEFAULT_CONFIG: GeneralConfig = {
    spawns: SpawnType.Consecutive,
    curseSpawns: CurseSpawnType.Randomly,
    pedestalSpawns: PedestalSpawnType.Randomly,
    multiSpawners: MultiSpawnerType.Randomly,
    options: ModOptions.SelectRandomItemOnEmpty,
    startingSkills: [],
};
