using HarmonyLib;
using System;
using System.Collections.Generic;
using System.Text;
using UnityEngine;

namespace cornercutter
{
    [HarmonyPatch(typeof(EntitySpawner), nameof(EntitySpawner.PickItemToSpawn))]
    class PickupSwapper
    {
        private static readonly string REPLACING_TEXT = "Replacing item spawn for ";

        static bool Prefix(ref EntitySpawner __instance, ref GameObject __result)
        {
            // Fetch this spawners parent, and their parent also
            GameObject parent = __instance.transform.parent?.gameObject;
            GameObject grandparent = parent.transform.parent?.gameObject;

            // All of the spawners we modify have parents, so skip the below if this instance doesn't
            if (parent == null) return true;

            SpawnCollection collectionToCheck = null;
            FloorConfig floorConfig = CutterConfig.Instance.GetFloorConfig(Singleton<DungeonManager>.instance.currentFloor + 1);

            if (__instance.name == "ItemSpawnSpot")
            {
                // Spawning in a treasure room, or the Ray skill room
                if (parent.name.StartsWith("UpgradeSpawn"))
                {
                    Console.WriteLine(REPLACING_TEXT + "treasure room!");
                    collectionToCheck = floorConfig.PickupSkills;
                }
                else if (parent.name.StartsWith("SkillSpawner") 
                    && grandparent != null && grandparent.name.StartsWith("Shop_Haunt"))
                {
                    Console.WriteLine(REPLACING_TEXT + "curse room!");
                    // Also using PickupSkills pool here for now
                    collectionToCheck = floorConfig.PickupSkills;
                }
            }
            // Spawning in the shop
            else if (__instance.name == "ShopSpotCafeSkill")
            {
                Console.WriteLine(REPLACING_TEXT + "shop!");
                collectionToCheck = floorConfig.ShopSkills;
            }

            else if (__instance.name == "FinalRoomBattlePickup")
            {
                Console.WriteLine(REPLACING_TEXT + "finale!");
                collectionToCheck = floorConfig.FinaleSkills;
            }

            // TODO: consider how to handle TreasureRoomPedastool

            // If not applicanle, don't swap, run the normal pick spawn method
            if (collectionToCheck == null) return true;

            GameObject swappedObject = collectionToCheck.GetNextSkill().gameObject;
            Console.WriteLine("Spawning in " + swappedObject.name);

            __result = swappedObject;

            // As we've set what this spawner should return, don't run the default pick spawn behaviour
            return false;
        }
    }
}
