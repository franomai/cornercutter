import { GlobalOptions } from './ModOptions.1';

export interface CornercutterConfig {
    isFirstStartup: boolean;
    isSetupSuccessful: boolean;
    enableUserMetrics: boolean;
}

export interface CornercutterModSettings {
    currentMod?: string;
    globalOptions: GlobalOptions;
}
