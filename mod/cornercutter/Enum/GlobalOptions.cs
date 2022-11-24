using System;

namespace cornercutter.Enum
{
    // This is a bitmask for the config options that are mod independent (enabled through the UI context bar).
    [Flags]
    public enum GlobalOptions
    {
        NoneSelected = 0,
        DisableCornercutter = 1 << 0,
        DisableHighscores = 1 << 1,
        DisableSteamAchievements = 1 << 2,
        RespectUnlocks = 1 << 3,
        EnableDebugMenu = 1 << 4,
        EnableExtraLogging = 1 << 5,
        EnsureAlwaysFiveCubitShopOptions = 1 << 6,
        EnableFreeCubitShop = 1 << 7
    }
}
