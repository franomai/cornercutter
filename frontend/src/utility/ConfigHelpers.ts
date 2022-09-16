import ModConfig, { GeneralConfig, Options } from '../types/Configuration';

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
