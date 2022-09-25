import { invoke } from '@tauri-apps/api';
import ModConfig, { DEFAULT_CONFIG, Floor, FloorSkills, Options, Room } from '../types/Configuration';
import { WeightedSkill } from '../types/Skill';

export function modHasOption(mod: ModConfig, flag: Options) {
    return flag === (mod.general.options & flag);
}

export function setModOptionFlag(mod: ModConfig, flag: Options, isSet: boolean) {
    if (isSet) {
        // Append flag
        mod.general.options |= flag;
    } else {
        // Remove flag
        mod.general.options &= ~flag;
    }
}

export function saveMod(mod: ModConfig): Promise<void> {
    return invoke('save_mod', { modConfig: mod });
}

export function generateEmptyMod(id: string): ModConfig {
    return {
        id,
        info: { name: '', description: '' },
        general: DEFAULT_CONFIG,
        floorSkills: generateEmptyFloorSkills(),
    };
}

export function generateEmptyFloorSkills(): FloorSkills {
    return {
        [Floor.AllFloors]: generateEmptyRoomSkills(),
        [Floor.FirstFloor]: generateEmptyRoomSkills(),
        [Floor.SecondFloor]: generateEmptyRoomSkills(),
        [Floor.ThirdFloor]: generateEmptyRoomSkills(),
        [Floor.Boss]: generateEmptyRoomSkills(),
    };
}

export function generateEmptyRoomSkills(): Record<Room, WeightedSkill[]> {
    return {
        [Room.All]: [],
        [Room.Free]: [],
        [Room.Shop]: [],
        [Room.Curse]: [],
        [Room.Finale]: [],
    };
}
