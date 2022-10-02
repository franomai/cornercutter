using System;
using System.Collections.Generic;
using System.Text;

namespace cornercutter.Enum
{
    // This is a enum used by TreasurePedestalSpawner to modify the spawn rate.
    // PedestalSpawnType.NoneSelected should not come through from a mod, as the UI for it is a radio button.
    public enum PedestalSpawnType
    {
        NoneSelected,
        Randomly,
        AlwaysFirstFloor,
        AlwaysLastFloor,
        Never
    }
}
