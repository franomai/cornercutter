using System;

namespace cornercutter.Enum
{
    // This is a bitmask for all the mod specific config options (i.e, enabled per mod).
    [Flags]
    public enum ConfigOptions
    {
        NoneSelected = 0,
        ConfigPerFloor = 1 << 0,
        ConfigPerRoom = 1 << 1,
        SelectRandomItemOnEmpty = 1 << 2,
        DisableMentorAbilities = 1 << 3,
        DisableGiftOfIntern = 1 << 4,
        DisablePinnedSkill = 1 << 5,
        AwardSkillsPerLevel = 1 << 6,
        DisableHealing = 1 << 7,
        DisableItemPickup = 1 << 8,
    }
}
