import { OptionDetails } from '../../components/forms/TooltipCheckbox';

export enum GlobalOptions {
    NoneSelected = 0,
    DisableCornercutter = 1 << 0,
    DisableHighscores = 1 << 1,
    DisableSteamAchievements = 1 << 2,
    RespectUnlocks = 1 << 3,
    EnableDebugMenu = 1 << 4,
    EnableExtraLogging = 1 << 5,
    EnsureAlwaysFiveCubitShopOptions = 1 << 6,
    EnableFreeCubitShop = 1 << 7,
    UnlockAllCostumes = 1 << 8,
}

export const globalOptionDetails: Record<GlobalOptions, OptionDetails> = {
    [GlobalOptions.DisableCornercutter]: {
        label: 'Disable Cornercutter',
        tooltip: 'Turns cornercutter off for the next run. No indicator will show in-game.',
    },
    [GlobalOptions.DisableHighscores]: {
        label: 'Disable highscores',
        tooltip:
            'New best times with Cornercutter enabled will not be saved, unless it is the first clear for that dungeon.',
    },
    [GlobalOptions.DisableSteamAchievements]: {
        label: 'Disable Steam achievements',
        tooltip: 'Turns off steam achievements for progression and unlocks.',
    },
    [GlobalOptions.RespectUnlocks]: {
        label: 'Only spawn unlocked skills',
        tooltip:
            'While enabled, mods will not spawn items not unlocked in gain - effectively, the pool will be reduced.',
    },
    [GlobalOptions.EnableDebugMenu]: {
        label: 'Enable debug menu',
        tooltip: 'Activates the debug menu in the pause screen.',
    },
    [GlobalOptions.EnableExtraLogging]: {
        label: 'Enable additional Cornercutter logging',
        tooltip: 'Adds some extra logging to Cornercutter to help diagnose spawning issues.',
    },
    [GlobalOptions.EnsureAlwaysFiveCubitShopOptions]: {
        label: 'Ensure the Cubit shop always has five skills',
        tooltip: 'The Cubit shop in Fizzle will always have five spots, rerolling skills if purchased.',
    },
    [GlobalOptions.EnableFreeCubitShop]: {
        label: 'Make the Cubit shop free',
        tooltip: 'Skills in the Cubit shop in Fizzle cost 0 cubits.',
    },
    [GlobalOptions.UnlockAllCostumes]: {
        label: 'Unlock all costumes',
        tooltip: 'Costumes in Jackie\'s wardrobe are all unlocked, regardless of overtime or main story progress.',
    },
};
