using cornercutter.Enum;
using cornercutter.ModLoader;
using HarmonyLib;

namespace cornercutter.ModFeature.GlobalSetting
{
    // TODO: check if we also need to disable achievement progress increments
    [HarmonyPatch(typeof(SteamManager), "TestAchievementComplete")]
    class SteamBlocker
    {
        static bool Prefix()
        {
            bool cornercutterEnabled = CutterConfig.Instance.CornercutterIsEnabled();

            GlobalOptions globals = CutterConfig.Instance.GlobalOptions;
            bool steamAchievementsDisabled = globals.HasFlag(GlobalOptions.DisableSteamAchievements);

            // false -> skip the original method which registers achievement completion against Steam
            return !(cornercutterEnabled && steamAchievementsDisabled);
        }
    }
}
