export default interface Configuration {
    disableHp: boolean;
    disableOtherDrops: boolean;
    spawns: SpawnType;
    curseSpawns: CurseSpawnType;
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
    disableHp: false,
    disableOtherDrops: false,
    spawns: SpawnType.Looped,
    curseSpawns: CurseSpawnType.Randomly,
};
