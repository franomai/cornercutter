import GlobalOptions from './Configuration';

export interface CornerCutterConfig {
    goingUnderDir?: string;
    setDirectory: boolean;
}

export interface CurrentModConfig {
    currentMod?: string;
    globalOptions: GlobalOptions;
}
