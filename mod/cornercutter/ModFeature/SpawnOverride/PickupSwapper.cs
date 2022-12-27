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
        static void LogReplacedSpawn(string spawnReplacedText)
        {
            CutterConfig.Instance.LogDebug("Replacing item spawn for " + spawnReplacedText);
        }

        static bool Prefix(ref EntitySpawner __instance, ref GameObject __result)
        {
            CutterConfig cornercutter = CutterConfig.Instance;
            if (!(cornercutter.CornercutterIsEnabled() && cornercutter.ModIsActive())) return true;

            // Fetch this spawners parent, and their parent also
            GameObject parent = __instance.transform.parent?.gameObject;
            GameObject grandparent = parent?.transform.parent?.gameObject;

            // All of the spawners we modify have parents, so skip the below if this instance doesn't
            // We also don't touch anything if we are not in a dungeon, so skip those evocations as well
            if (parent == null || Singleton<DungeonManager>.instance == null) return true;

            ConfigOptions options = CutterConfig.Instance.ConfigOptions;

            cornercutter.LogDebug("!--- Spawner values are:");
            cornercutter.LogDebug(__instance.name);
            cornercutter.LogDebug(parent.name);
            cornercutter.LogDebug(grandparent?.name);
            cornercutter.LogDebug("!---");

            SpawnCollection collectionToCheck = null;
            int currentFloor = Singleton<DungeonManager>.instance.currentFloor;

            // If the run is an imposter run, use a repeating 1 -> 2 -> boss structure;
            if (Singleton<DungeonManager>.instance.isBigRun)
            {
                currentFloor %= 3;
                if (currentFloor == 2)
                {
                    currentFloor = 3;
                }
            }
            currentFloor += 1;

            cornercutter.LogDebug("Getting config for floor " + currentFloor);
            FloorConfig floorConfig = CutterConfig.Instance.GetFloorConfig(currentFloor);

            if (__instance.name == "ItemSpawnSpot")
            {
                // Spawning in a treasure room, or the Ray skill room
                if (parent.name.StartsWith("UpgradeSpawn"))
                {
                    LogReplacedSpawn("treasure room!");
                    collectionToCheck = floorConfig.FreeSkills;
                }
                else if (parent.name.StartsWith("SkillSpawner") && grandparent != null)
                {
                    if (grandparent != null)
                    {
                        if (grandparent.name.StartsWith("Shop_Haunt"))
                        {
                            LogReplacedSpawn("curse room!");
                            collectionToCheck = floorConfig.CurseSkills;
                        }
                        else if (grandparent.name.StartsWith("ChaosRoomSkill"))
                        {
                            LogReplacedSpawn("coworking space skill!");
                            collectionToCheck = floorConfig.FreeSkills;
                        }
                        // These are the Cubicle boss shops before Avie
                        else if (grandparent.name.StartsWith("GameObject") ||
                            grandparent.name.StartsWith("CubicleRoomLILLI") ||
                            grandparent.name.StartsWith("CubicleRoomZANS"))
                        {
                            LogReplacedSpawn("cubicle shop!");
                            collectionToCheck = floorConfig.ShopSkills;
                        }
                    }
                    else
                    {
                        // No grandparent - for example, the thrown items in the Avie boss fight. It's F R E E
                        LogReplacedSpawn("free skill!");
                        collectionToCheck = floorConfig.FreeSkills;
                    }
                }
            }
            // Check to see if this is the curse room bonus skill
            else if (__instance.name == "SkillSpawn" && parent.name.StartsWith("HauntMultiSpawner")
                    && grandparent != null && grandparent.name.StartsWith("Shop_Haunt"))
            {
                LogReplacedSpawn("curse room bonus skill (congrats)!");
                collectionToCheck = floorConfig.CurseSkills;
            }

            // Handle tappi custom shop kiosk
            else if (__instance.name == "SkillSpawn" && parent.name.StartsWith("TappiShopMultispawner")
                    && grandparent != null && grandparent.name.StartsWith("Stuff")) // :thinking:
            {
                LogReplacedSpawn("Tappi kiosk!");
                collectionToCheck = floorConfig.ShopSkills;
            }

            // Handle case where a TreasureRoomPedastool has spawned mid-dungeon
            else if (__instance.name == "SkillSpawn" && parent.name.StartsWith("MultiSpawner")
                    && grandparent != null && (grandparent.name.StartsWith("TreasureRoomPedestal")
                    || grandparent.name.StartsWith("TreasureRoomPedastool"))) // Typo in source ):
            {
                LogReplacedSpawn("treasure room pedestal (good luck)!");
                collectionToCheck = floorConfig.FreeSkills;
            }

            // Spawning in the shop - Styx shop will have this cloned with a (1) suffix
            else if (__instance.name.StartsWith("ShopSpotCafeSkill"))
            {
                LogReplacedSpawn("shop!");
                collectionToCheck = floorConfig.ShopSkills;
            }

            // Spawning on a shop skill reroll
            else if (__instance.name == "WeaponSpot Variant" ||
                __instance.name == "ShopSpotCafeSkill Variant")
            {
                LogReplacedSpawn("shop reroll skill!");
                collectionToCheck = floorConfig.ShopSkills;
            }

            else if (__instance.name == "FinalRoomBattlePickup")
            {
                LogReplacedSpawn("finale!");
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
                cornercutter.LogDebug("Skill pool exhausted, reverting to usual spawner.");
                return true;
            }

            if (swappedObject == null && !options.HasFlag(ConfigOptions.DisableGiftOfIntern))
            {
                // This is required so we can snipe GOTI spawns properly in downstream Postfixes
                swappedObject = GlobalSettings.defaults.fallbackSkill;
            }

            cornercutter.LogDebug("Spawning in " + (swappedObject == null ? "nothing!" : swappedObject.name));

            __result = swappedObject;

            // As we've set what this spawner should return, don't run the default pick spawn behaviour
            return false;
        }

        static void Postfix(ref GameObject __result)
        {
            CutterConfig.Instance.LogDebug("Final item, " + (__result == null ? "nothing!" : __result.name));
        }
    }
}
