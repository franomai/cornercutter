import { WeightedSkill } from './Skill';
import {
    CurseSpawnType,
    Floor,
    GlobalOptions,
    ModOptions,
    MultiSpawnerType,
    PedestalSpawnType,
    Room,
    SpawnType,
} from './enums/ConfigEnums';

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

export type Options = number & (ModOptions | GlobalOptions);

export const DEFAULT_CONFIG: GeneralConfig = {
    spawns: SpawnType.Consecutive,
    curseSpawns: CurseSpawnType.Randomly,
    pedestalSpawns: PedestalSpawnType.Randomly,
    multiSpawners: MultiSpawnerType.Randomly,
    options: ModOptions.SelectRandomItemOnEmpty,
    startingSkills: [],
};
