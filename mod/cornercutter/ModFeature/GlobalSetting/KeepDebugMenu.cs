using cornercutter.Enum;
using cornercutter.ModLoader;
using HarmonyLib;

namespace cornercutter.ModFeature.GlobalSetting
{
    [HarmonyPatch(typeof(DestroyIfNotDebug), "OnEnable")]
    class KeepDebugMenu
    {
        // TODO: Verify this will get recreated properly when this feature is toggled
        static bool Prefix()
        {
            bool cornercutterEnabled = CutterConfig.Instance.CornercutterIsEnabled();

            GlobalOptions globals = CutterConfig.Instance.GlobalOptions;
            bool debugMenuEnabled = globals.HasFlag(GlobalOptions.EnableDebugMenu);

            // false -> skip the original method which removes the debug menu
            return !(cornercutterEnabled && debugMenuEnabled);
        }
    }
}
