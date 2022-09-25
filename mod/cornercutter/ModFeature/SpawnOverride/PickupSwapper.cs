using cornercutter.Enum;
using cornercutter.ModFeature.SpawnOverride.CollectionTypes;
using cornercutter.ModLoader;
using HarmonyLib;
using System;
using UnityEngine;

namespace cornercutter.ModFeature.SpawnOverride
{
    [HarmonyPatch(typeof(EntitySpawner), nameof(EntitySpawner.PickItemToSpawn))]
    class PickupSwapper
    {
        // TODO: Move this out into a global logger
        static bool LoggingEnabled()
        {
            GlobalOptions globals = CutterConfig.Instance.GlobalOptions;
            return globals.HasFlag(GlobalOptions.EnableExtraLogging);
        }

        static void PrintReplacedSpawn(string spawnReplacedText)
        {
            PrintExtraLogging("Replacing item spawn for " + spawnReplacedText);
        }

        static void PrintExtraLogging(string text)
        {
            if (LoggingEnabled())
            {
                Console.WriteLine(text);
            }
        }

        static bool Prefix(ref EntitySpawner __instance, ref GameObject __result)
        {
            // Fetch this spawners parent, and their parent also
            GameObject parent = __instance.transform.parent?.gameObject;
            GameObject grandparent = parent?.transform.parent?.gameObject;

            // All of the spawners we modify have parents, so skip the below if this instance doesn't
            // We also don't touch anything if we are not in a dungeon, so skip those evocations as well
            if (parent == null || Singleton<DungeonManager>.instance == null) return true;

            
            ConfigOptions options = CutterConfig.Instance.ConfigOptions;

            if (LoggingEnabled()) {
                Console.WriteLine("!--- Spawner values are:");
                Console.WriteLine(__instance.name);
                Console.WriteLine(parent.name);
                Console.WriteLine(grandparent?.name);
                Console.WriteLine("!---");
            }

            SpawnCollection collectionToCheck = null;
            int currentFloor = Singleton<DungeonManager>.instance.currentFloor + 1;
            FloorConfig floorConfig = CutterConfig.Instance.GetFloorConfig(currentFloor);

            if (__instance.name == "ItemSpawnSpot")
            {
                // Spawning in a treasure room, or the Ray skill room
                if (parent.name.StartsWith("UpgradeSpawn"))
                {
                    PrintReplacedSpawn("treasure room!");
                    collectionToCheck = floorConfig.FreeSkills;
                }
                else if (parent.name.StartsWith("SkillSpawner")
                    && grandparent != null && grandparent.name.StartsWith("Shop_Haunt"))
                {
                    PrintReplacedSpawn("curse room!");
                    collectionToCheck = floorConfig.CurseSkills;
                }
            }
            // Check to see if this is the curse room bonus skill
            else if (__instance.name == "SkillSpawn" && parent.name.StartsWith("HauntMultiSpawner")
                    && grandparent != null && grandparent.name.StartsWith("Shop_Haunt"))
            {
                PrintReplacedSpawn("curse room bonus skill (congrats)!");
                collectionToCheck = floorConfig.CurseSkills;
            }

            // Handle tappi custom shop kiosk
            else if (__instance.name == "SkillSpawn" && parent.name.StartsWith("TappiShopMultispawner")
                    && grandparent != null && grandparent.name.StartsWith("Stuff")) // :thinking:
            {
                PrintReplacedSpawn("Tappi kiosk!");
                collectionToCheck = floorConfig.ShopSkills;
            }

            // Handle case where a TreasureRoomPedastool has spawned mid-dungeon
            else if (__instance.name == "SkillSpawn" && parent.name.StartsWith("MultiSpawner")
                    && grandparent != null && grandparent.name.StartsWith("TreasureRoomPedestal"))
            {
                PrintReplacedSpawn("treasure room pedastool (good luck)!");
                collectionToCheck = floorConfig.FreeSkills;
            }

            // Spawning in the shop
            else if (__instance.name == "ShopSpotCafeSkill")
            {
                PrintReplacedSpawn("shop!");
                collectionToCheck = floorConfig.ShopSkills;
            }

            // Spawning on a shop skill reroll
            else if (__instance.name == "WeaponSpot Variant" ||
                __instance.name == "ShopSpotCafeSkill Variant")
            {
                PrintReplacedSpawn("shop reroll skill!");
                collectionToCheck = floorConfig.ShopSkills;
            }

            else if (__instance.name == "FinalRoomBattlePickup")
            {
                PrintReplacedSpawn("finale!");
                collectionToCheck = floorConfig.FinaleSkills;
            }

            // If not applicable, don't swap, run the normal pick spawn method
            if (collectionToCheck == null) return true;

            if (!options.HasFlag(ConfigOptions.ConfigPerRoom))
            {
                // Use the all skills pool instead of whichever custom one selected
                collectionToCheck = floorConfig.AllSkills;
            }

            GameObject swappedObject = collectionToCheck.GetNextSkill()?.gameObject;

            if (swappedObject == null && options.HasFlag(ConfigOptions.SelectRandomItemOnEmpty))
            {
                // We couldn't give them an item, so use the default spawner instead
                return true;
            }

            // Special handling needed here for finales and empty collections, otherwise we get no GOTI
            if (__instance.name == "FinalRoomBattlePickup" && swappedObject == null && !options.HasFlag(ConfigOptions.DisableGiftOfIntern))
            {
                swappedObject = GlobalSettings.defaults.fallbackSkill;
            }

            PrintExtraLogging("Spawning in " + (swappedObject == null ? "nothing!" : swappedObject.name));

            __result = swappedObject;

            // As we've set what this spawner should return, don't run the default pick spawn behaviour
            return false;
        }

        static void Postfix(ref GameObject __result)
        {
            PrintExtraLogging("Final item, " + (__result == null ? "nothing!" : __result.name));
        }
    }
}
