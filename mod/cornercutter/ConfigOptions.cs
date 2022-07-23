using System;

namespace cornercutter
{
    // This is a bitmask for all the cornercutter options, to compress what's coming out of the app
    [Flags]
    public enum ConfigOptions
    {
        NoOptionsSelected = 0,
        LoopSpawns = 1,
        AwardPerLevel = 2,
        ConfigPerFloor = 4
    }
}
