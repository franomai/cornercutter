using cornercutter.Enum;
using cornercutter.ModLoader;
using HarmonyLib;

namespace cornercutter.ModFeature.GlobalSetting
{
    [HarmonyPatch(typeof(SaveData), nameof(SaveData.ConfirmRun))]
    class BestRunBlocker
    {
        // Note that this time will only show up in game if you have no other runs for that dungeon
        private const float ONE_DAY_IN_SECONDS = 60 * 60 * 24;

        static void Postfix(ref SaveData __instance, ref RunData runData)
        {
            CutterConfig cornercutter = CutterConfig.Instance;
            GlobalOptions globals = cornercutter.GlobalOptions;
            if (!cornercutter.CornercutterIsEnabled()) return;
            if (!globals.HasFlag(GlobalOptions.DisableHighscores)) return;

            // Because other parts of the run end routine are using this runData reference, we have to
            // make a copy with the invalid time and overwrite the run that's there, rather than
            // changing runData.runTime directly
            __instance.runs[__instance.runs.Count - 1] = CloneRunData(runData);
        }

        static RunData CloneRunData(RunData originalRunData)
        {
            RunData clonedRunData = new RunData
            {
                company = originalRunData.company,
                isFounder = originalRunData.isFounder,
                monstersSlain = originalRunData.monstersSlain,
                combatsCleared = originalRunData.combatsCleared,
                floorsCleared = originalRunData.floorsCleared,
                totalMoney = originalRunData.totalMoney,
                startingCubits = originalRunData.startingCubits,
                runTime = ONE_DAY_IN_SECONDS,
                won = originalRunData.won
            };
            return clonedRunData;
        }
    }

    [HarmonyPatch(typeof(GameManager), nameof(GameManager.IsBestTime))]
    class BestTimeImageBlocker
    {
        static bool Prefix(ref bool __result)
        {
            CutterConfig cornercutter = CutterConfig.Instance;
            GlobalOptions globals = cornercutter.GlobalOptions;
            if (!cornercutter.CornercutterIsEnabled()) return true;
            if (!globals.HasFlag(GlobalOptions.DisableHighscores)) return true;

            // If highscores are disabled, don't check if this run is best, just display nothing
            __result = false;
            return false;
        }
    }
}
