using cornercutter.ModLoader;
using HarmonyLib;
using System;
using UnityEngine;

using static cornercutter.ModFeature.SpecialMods.CornercutterChristmas.GiftHandler;

namespace cornercutter.ModFeature.SpecialMods.CornercutterChristmas
{
    class GiftListeners
    {
        static readonly string[] BannedItems = {
            "GenericItemEmpty",
            "Crate_Keyfob",
            "Minecart",
            "ladder",
            "ladder 1",
            "PinkSlip",
            "AvieCube",
            "ThatDrip",
            "GameCubicle",
            "EspressoMachine"
        };

        static readonly System.Random rng = new System.Random();
        public static int CurrentPurchases = 0;
        public static float LastKillTime = 0;

        public static void RegisterListeners(GiftType giftType)
        {
            switch (giftType)
            {
                case GiftType.AppsGrantNewApps:
                    GameManager.events.OnPlayerUsedApp += new EventManager.PlayerUsedAppDel(RerollAppOnLastUse);
                    break;
                case GiftType.SpeedAndKnockbackIncrease:
                    GameManager.events.OnEntityHit += ApplyBigKnockback;
                    break;
                case GiftType.EnemiesExplodeIntoWeapons:
                    GameManager.events.OnEntityKilled += EnemiesDropRandomStuff;
                    break;
                case GiftType.KillsForceCrits:
                    GameManager.events.OnCalculateCritChance += GiveKillCrit;
                    GameManager.events.OnEntityKilled += RecordLastKillTime;
                    break;
                case GiftType.BuyingFromShopsWeakensEnemies:
                    GameManager.events.OnEntityBought += RegisterPurchase;
                    break;
                case GiftType.CratesDropMoreItems:
                    GameManager.events.OnEntityKilled += SpawnMoreCrateStuff;
                    break;
                default:
                    return;
            }
        }

        public static void DeregisterListeners(GiftType giftType)
        {
            switch (giftType)
            {
                case GiftType.AppsGrantNewApps:
                    GameManager.events.OnPlayerUsedApp -= new EventManager.PlayerUsedAppDel(RerollAppOnLastUse);
                    break;
                case GiftType.SpeedAndKnockbackIncrease:
                    GameManager.events.OnEntityHit -= ApplyBigKnockback;
                    break;
                case GiftType.EnemiesExplodeIntoWeapons:
                    GameManager.events.OnEntityKilled -= EnemiesDropRandomStuff;
                    break;
                case GiftType.KillsForceCrits:
                    GameManager.events.OnCalculateCritChance -= GiveKillCrit;
                    GameManager.events.OnEntityKilled -= RecordLastKillTime;
                    LastKillTime = 0;
                    break;
                case GiftType.BuyingFromShopsWeakensEnemies:
                    GameManager.events.OnEntityBought -= RegisterPurchase;
                    CurrentPurchases = 0;
                    break;
                case GiftType.CratesDropMoreItems:
                    GameManager.events.OnEntityKilled -= SpawnMoreCrateStuff;
                    break;
                default:
                    return;
            }
        }

        // GiftType.AppsGrantNewApps 
        static void RerollAppOnLastUse(App app)
        {
            CutterConfig cornercutter = CutterConfig.Instance;
            DebugStuff resources = cornercutter.GetDebugResources();
            if (app == null || resources == null) return;
            if (app.usesLeft != 1) return;
            if (rng.NextDouble() > 1 - Math.Pow(0.5, CurrentStacks[GiftType.AppsGrantNewApps])) return;
            // Congrats, you win!
            resources.GainRandomApp();
        }

        // GiftType.SpeedAndKnockbackIncrease
        static void ApplyBigKnockback(HitInfo info)
        {
            if (info.target is Enemy)
            {
                info.knockback *= (float) Math.Pow(4, CurrentStacks[GiftType.SpeedAndKnockbackIncrease]);
            }
        }

        // GiftType.EnemiesExplodeIntoWeapons
        static void EnemiesDropRandomStuff(KillInfo info)
        {
            CutterConfig cornercutter = CutterConfig.Instance;
            DebugStuff resources = cornercutter.GetDebugResources();
            if (info == null || resources == null || !(info.killHit.target is Enemy)) return;
            for (int i = 0; i < Math.Pow(2, CurrentStacks[GiftType.EnemiesExplodeIntoWeapons]); i++)
            {
                GameObject item = resources.AllProps.RandomSelection((GameObject f) => 1);
                if (Array.IndexOf(BannedItems, item.name) != -1)
                {
                    i--;
                    continue;
                }
                cornercutter.LogDebug("Selected item as " + item.name);
                info.killHit.target.AddDrop(item);
            }
            ParticleManager.instance.PlayExplosion(info.killHit.target.GetCenter());
        }

        // GiftType.KillsForceCrits
        static void RecordLastKillTime(KillInfo info)
        {
            HitInfo killHit = info.killHit;
            if (killHit.attacker != Player.singlePlayer && killHit.attacker.wielder != Player.singlePlayer) return;
            LastKillTime = Time.time;
        }

        // GiftType.BuyingFromShopsWeakensEnemies
        static void GiveKillCrit(HitInfo info, CritChanceInfo critInfo)
        {
            if (info.attacker != Player.singlePlayer || (LastKillTime + 7 * CurrentStacks[GiftType.KillsForceCrits]) < Time.time) return;
            critInfo.guaranteed = true;
        }

        static void RegisterPurchase(EntityBoughtInfo info)
        {
            CurrentPurchases++;
        }

        // GiftType.CratesDropMoreItems
        static void SpawnMoreCrateStuff(KillInfo info)
        {
            if (info == null) return;
            CrateContainsStuff component = info.killHit.target.GetComponent<CrateContainsStuff>();
            if (component == null) return;
            component.SpawnMore((int) Math.Pow(2, CurrentStacks[GiftType.SpeedAndKnockbackIncrease] + 1) - 1);
        }
    }

    class GiftEffects
    {
        static readonly string[] BannedFollowers = {
            "CubicleGroundBotElectricity Variant",
            "CubicleGroundBotFire Variant",
            "CubicleGroundBotIce Variant",
            "CubicleGroundBotSawblade Variant",
            "CubicleGroundBotSmall",
            "Joblin"
        };

        public static bool RunGiftOnApplied(GiftType giftType, BackupSkill skillInstance)
        {
            CutterConfig cornercutter = CutterConfig.Instance;
            DebugStuff resources = cornercutter.GetDebugResources();
            if (resources == null) return false;
            switch (giftType)
            {
                case GiftType.RandomSkills:
                    for (int i = 0; i < 5; i++)
                    {
                        resources.GainRandomSkill();
                    }
                    break;
                case GiftType.RandomFollowers:
                    for (int i = 0; i < 5; i++)
                    {
                        GameObject companion = resources.AllEnemies.RandomSelection((GameObject f) => 1);
                        if (Array.IndexOf(BannedFollowers, companion.name) != -1)
                        {
                            i--;
                            continue;
                        }
                        cornercutter.LogDebug("Selected companion as " + companion.name);
                        EnemyCompanion.AddBuff(skillInstance.moddedEntity, companion, skillInstance.moddedEntity.transform.position, EnemyCompanion.CompanionType.Platonic, false);
                    }
                    break;
                case GiftType.SpeedAndKnockbackIncrease:
                    Entity ent = skillInstance.moddedEntity;
                    if (ent is Player player)
                    {
                        player.speedBuff += 1.25f;
                        player.stats.velocityHardCap *= 1.25f;
                    }
                    break;
                default:
                    return true;
            }
            return true;
        }

        public static void RunGiftOnRemoved(GiftType giftType, BackupSkill skillInstance)
        {
            switch (giftType)
            {
                case GiftType.SpeedAndKnockbackIncrease:
                    Entity ent = skillInstance.moddedEntity;
                    if (ent is Player player)
                    {
                        player.speedBuff -= 1.25f;
                        player.stats.velocityHardCap /= 1.25f;
                    }
                    break;
                default:
                    return;
            }
        }
    }

    // GiftType.BuyingFromShopsWeakensEnemies
    [HarmonyPatch(typeof(Enemy), "GetAdjustedMaxHealth")]
    class BuyingReducesHP
    {
        static void Prefix(ref Enemy __instance)
        {
            int currentStacks = CurrentStacks[GiftType.BuyingFromShopsWeakensEnemies];
            if (currentStacks == 0) return;
            float currentMax = __instance.MaxHealth;
            float healthAdjustment = (__instance.MaxHealth * 0.25f) + (__instance.MaxHealth * currentStacks * GiftListeners.CurrentPurchases * 0.05f);
            __instance.MaxHealth = Math.Max(currentMax - healthAdjustment, 1);
        }
    }

    // GiftType.ItemsAreRarer
    [HarmonyPatch(typeof(RarityCurves), "get_rarityWeights")]
    class RaritySwapper
    {
        static void Postfix(ref int[] __result)
        {
            int currentStacks = CurrentStacks[GiftType.ItemsAreRarer];
            if (currentStacks == 0) return;
            __result = new int[5] { 0, 0, 0, 1, (int) Math.Pow(2, currentStacks - 1) };
        }
    }
}
