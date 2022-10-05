using cornercutter.Enum;
using cornercutter.ModLoader;
using HarmonyLib;
using UnityEngine;

namespace cornercutter.ModFeature.GlobalSetting
{
    [HarmonyPatch(typeof(DestroyIfNotDebug), "OnEnable")]
    class KeepDebugMenu
    {
        // TODO: Verify this will get recreated properly when this feature is toggled
        static bool Prefix(DestroyIfNotDebug __instance)
        {
            CutterConfig.Instance.LogDebug("Setting debug menu...");
            CutterConfig.Instance.SetDebugMenu(__instance.GetComponentInChildren<PauseTabButton>());
            // false -> skip the original method which removes the debug menu
            return false;
        }
    }
}
