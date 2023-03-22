using cornercutter.Enum;
using cornercutter.ModLoader;
using HarmonyLib;

namespace cornercutter.ModFeature.GlobalSetting
{
    [HarmonyPatch(typeof(Costume), "get_isUnlocked")]
    class UnlockAllCostumes
    {
        // Doing this as a prefix so we skip save data calls if everything is unlocked
        static bool Prefix(ref bool __result, ref Costume __instance)
        {
            CutterConfig cornercutter = CutterConfig.Instance;
            GlobalOptions globals = cornercutter.GlobalOptions;
            if (
                (cornercutter.CornercutterIsEnabled() && globals.HasFlag(GlobalOptions.UnlockAllCostumes))
                ||
                // If the costume we are looking at is the one we have on, it must have been unlocked at some point
                GlobalSettings.defaults.jackieCostumes[SaveData.instance.GetInt("currentCostume")] == __instance
             )
            {
                __result = true;
                return false;
            }
            // Run the original unlock logic
            return true;
        }
    }
}