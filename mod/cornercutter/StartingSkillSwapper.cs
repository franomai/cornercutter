using HarmonyLib;
using System;
using System.Collections.Generic;
using System.Text;

namespace cornercutter
{
    [HarmonyPatch(typeof(DungeonManager), nameof(DungeonManager.GenerateFloorRoutine))]
    class StartingSkillSwapper
    {
        static void Postfix(ref DungeonManager __instance)
        {
            FloorConfig floorConfig = CutterConfig.Instance.GetFloorConfig(__instance.currentFloor + 1);
            if (floorConfig.StartingSkills == null) return;

            Console.WriteLine("Starting skills found, attaching...");
            foreach (WeightedSkill skill in floorConfig.StartingSkills.GetAllSkills())
            {
                Console.WriteLine("Adding " + skill.Skill.gameObject.name);
                skill.Skill.GetComponentInChildren<EntityMod>().ApplyFromPrefab(Player.singlePlayer);
            }
        }
    }
}
