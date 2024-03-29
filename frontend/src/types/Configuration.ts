import { WeightedSkill } from './Skill';
import { CurseSpawnType, Floor, MultiSpawnerType, PedestalSpawnType, Room, SpawnType } from './enums/ConfigEnums';
import { GlobalOptions } from './enums/GlobalOptions';
import { ModOptions } from './enums/ModOptions';

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
