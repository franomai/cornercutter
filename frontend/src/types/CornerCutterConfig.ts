import { GlobalOptions } from './Configuration';

export interface CornerCutterConfig {
    goingUnderDir?: string;
    setDirectory: boolean;
}

export interface CornerCutterModSettings {
    currentMod?: string;
    globalOptions: GlobalOptions;
}
