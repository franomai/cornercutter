import ModConfig, { DEFAULT_CONFIG, FloorSkills, Options } from '../types/Configuration';

import { WeightedSkill } from '../types/Skill';
import { ModOptions, GlobalOptions, Floor, Room } from '../types/enums/ConfigEnums';

export function hasOptionSet(option: Options, flag: Options) {
    return flag === (option & flag);
}

export function setOptionFlag(
    option: ModOptions | GlobalOptions,
    flag: ModOptions | GlobalOptions,
    isSet: boolean,
): ModOptions | GlobalOptions {
    if (isSet) {
        // Append flag
        option |= flag;
    } else {
        // Remove flag
        option &= ~flag;
    }
    return option;
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
