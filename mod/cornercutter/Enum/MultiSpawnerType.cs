using System;
using System.Collections.Generic;
using System.Text;

namespace cornercutter.Enum
{
    // This is a enum used by MultiSpawnSwapper to pick which sub-type to create when faced with a spawner with multiple options,
    // PedestalSpawnType.NoneSelected should not come through from a mod, as the UI for it is a radio button.

    public enum MultiSpawnerType
    {
        NoneSelected,
        Randomly,
        AlwaysSkillIfAble,
        Never,
    }
}
