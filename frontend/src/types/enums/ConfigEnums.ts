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
