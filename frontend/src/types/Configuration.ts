export default interface Configuration extends GeneralConfig {
    startingSkillIds: number[];
}

interface GeneralConfig {
    spawns: SpawnType;
    curseSpawns: CurseSpawnType;
    configPerFloor: boolean;
    configPerRoom: boolean;
    removeHealingItems: boolean;
    disableMentorAbilities: boolean;
    disableGiftOfIntern: boolean;
    disablePinned: boolean;
    awardSkillsPerLevel: boolean;
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

export const DEFAULT_GENERAL_CONFIG: GeneralConfig = {
    spawns: SpawnType.Looped,
    curseSpawns: CurseSpawnType.Randomly,
    configPerFloor: false,
    configPerRoom: false,
    removeHealingItems: false,
    disableMentorAbilities: false,
    disableGiftOfIntern: false,
    disablePinned: false,
    awardSkillsPerLevel: false,
};

export const DEFAULT_CONFIG: Configuration = {
    spawns: SpawnType.Looped,
    curseSpawns: CurseSpawnType.Randomly,
    configPerFloor: false,
    configPerRoom: false,
    removeHealingItems: false,
    disableMentorAbilities: false,
    disableGiftOfIntern: false,
    disablePinned: false,
    awardSkillsPerLevel: false,
    startingSkillIds: [],
};
