import { GlobalOptions } from './Configuration';

export interface CornerCutterConfig {
    goingUnderDir?: string;
    setDirectory: boolean;
    enableUserMetrics: boolean;
}

export interface CornerCutterModSettings {
    currentMod?: string;
    globalOptions: GlobalOptions;
}
