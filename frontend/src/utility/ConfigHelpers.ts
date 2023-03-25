import { Options } from '../types/Configuration';
import { ModOptions } from '../types/enums/ModOptions';
import { GlobalOptions } from '../types/enums/GlobalOptions';

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
