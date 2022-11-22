using cornercutter.Enum;
using cornercutter.ModFeature.SpawnOverride.CollectionTypes;
using cornercutter.ModLoader;
using HarmonyLib;
using System;

namespace cornercutter.ModFeature.ModSetting
{
    [HarmonyPatch(typeof(DungeonManager), nameof(DungeonManager.GenerateFloorRoutine))]
    class StartingSkillSwapper
    {
        static void Postfix(ref DungeonManager __instance)
        {
            CutterConfig cornercutter = CutterConfig.Instance;
            if (!(cornercutter.CornercutterIsEnabled() && cornercutter.ModIsActive())) return;

            int currentFloor = __instance.currentFloor + 1;
            WeightedSkill[] startingSkills = cornercutter.StartingSkills;
            if (startingSkills.Length == 0) return;

            ConfigOptions options = cornercutter.ConfigOptions;

            if (currentFloor == 1 || options.HasFlag(ConfigOptions.AwardSkillsPerLevel))
            {
                cornercutter.LogDebug("Starting skills found, attaching...");
                foreach (WeightedSkill skill in startingSkills)
                {
                    cornercutter.LogDebug("Adding " + skill.Skill.gameObject.name);
                    skill.Skill.GetComponentInChildren<EntityMod>().ApplyFromPrefab(Player.singlePlayer);
                }
            }
        }
    }
}
