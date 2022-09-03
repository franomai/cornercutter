export default interface Configuration extends GeneralConfig {}

interface GeneralConfig {
    spawns: SpawnType;
    curseSpawns: CurseSpawnType;
    options: Options;
    startingSkillIds: number[];
}

export enum SpawnType {
    Looped = 'Looped',
    Weighted = 'Weighted',
    Consecutive = 'Consecutive',
}

export enum CurseSpawnType {
    Randomly = 'Randomly',
    Always = 'Always',
    Never = 'Never',
}

export enum Floor {
    AllFloors,
    FirstFloor,
    SecondFloor,
    ThirdFloor,
    Boss,
}

export enum Options {
    NoneSelected = 0,
    ConfigPerFloor = 1 << 0,
    ConfigPerRoom = 1 << 1,
    RemoveHealingItems = 1 << 2,
    DisableMentorAbilities = 1 << 3,
    DisableGiftOfIntern = 1 << 4,
    DisablePinned = 1 << 5,
    AwardSkillsPerLevel = 1 << 6,
}

export const DEFAULT_CONFIG: Configuration = {
    spawns: SpawnType.Looped,
    curseSpawns: CurseSpawnType.Randomly,
    options: Options.RemoveHealingItems | Options.DisablePinned,
    startingSkillIds: [],
};
