import ModConfig, { Floor, FloorSkills, Options, Room } from '../types/Configuration';
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
        [Room.Skill]: [],
        [Room.Shop]: [],
        [Room.Curse]: [],
        [Room.Finale]: [],
    };
}
