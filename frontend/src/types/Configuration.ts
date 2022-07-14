export default interface Configuration {
    spawns: SpawnType;
    curseSpawns: CurseSpawnType;
    configPerFloor: boolean;
    configPerRoom: boolean;
    disableHp: boolean;
    disableOtherDrops: boolean;
    blankOnEmpty: boolean;
    disablePinned: boolean;
    awardPerLevel: boolean;
}

export enum SpawnType {
    Looped = 'Looped',
    Weighted = 'Weighted',
}

export enum CurseSpawnType {
    Randomly = 'Randomly',
    Always = 'Always',
    Never = 'Never',
}

export const DEFAULT_CONFIG: Configuration = {
    spawns: SpawnType.Looped,
    curseSpawns: CurseSpawnType.Randomly,
    configPerFloor: false,
    configPerRoom: false,
    disableHp: false,
    disableOtherDrops: false,
    blankOnEmpty: false,
    disablePinned: false,
    awardPerLevel: false,
};
