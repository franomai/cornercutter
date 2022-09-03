import Configuration, { Options } from '../types/Configuration';

export function optionsHasFlag(config: Configuration, flag: Options) {
    return flag === (config.options & flag);
}

export function setOptionFlag(config: Configuration, flag: Options, isSet: boolean) {
    if (isSet) {
        // Append flag
        config.options |= flag;
    } else {
        // Remove flag
        config.options &= ~flag;
    }
}
