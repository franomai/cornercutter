using cornercutter.ModLoader;
using HarmonyLib;

namespace cornercutter.ModFeature.GlobalSetting
{
    [HarmonyPatch(typeof(DestroyIfNotDebug), "OnEnable")]
    class KeepDebugMenu
    {
        static bool Prefix(DestroyIfNotDebug __instance)
        {
            CutterConfig.Instance.LogDebug("Setting debug menu...");
            CutterConfig.Instance.SetDebugMenu(__instance.GetComponentInChildren<PauseTabButton>());
            // false -> skip the original method which removes the debug menu
            return false;
        }
    }
}
