import Configuration, { GeneralConfig, Options } from '../types/Configuration';

export function optionsHasFlag(config: GeneralConfig, flag: Options) {
    return flag === (config.options & flag);
}

export function setOptionFlag(config: GeneralConfig, flag: Options, isSet: boolean) {
    if (isSet) {
        // Append flag
        config.options |= flag;
    } else {
        // Remove flag
        config.options &= ~flag;
    }
}
