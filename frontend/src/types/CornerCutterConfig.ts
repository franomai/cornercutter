import { GlobalOptions } from './Configuration';

export interface CornerCutterConfig {
    goingUnderDir?: string;
    setDirectory: boolean;
    isFirstStartup: boolean;
    isSetupSuccessful: boolean;
    enableUserMetrics: boolean;
}

export interface CornerCutterModSettings {
    currentMod?: string;
    globalOptions: GlobalOptions;
}
