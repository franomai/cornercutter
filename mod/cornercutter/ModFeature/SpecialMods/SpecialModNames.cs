using System.Collections.Generic;

namespace cornercutter.ModFeature.SpecialMods
{
    class ModNames
    {
        public enum SpecialMod
        {
            None,
            CornercutterChristmas,
            FirstPerson,
            FirstPersonHardcore
        }

        static readonly Dictionary<string, SpecialMod> SpecialMods = new Dictionary<string, SpecialMod> {
            { "Cornercutter Christmas", SpecialMod.CornercutterChristmas},
            { "Self-centered", SpecialMod.FirstPerson},
            { "Self-centered, hardcore", SpecialMod.FirstPersonHardcore}
        };

        public static SpecialMod GetModFromName(string modName)
        {
            return SpecialMods.ContainsKey(modName) ? SpecialMods[modName] : SpecialMod.None;
        }

    }
}
