using cornercutter.Enum;
using cornercutter.ModLoader;
using HarmonyLib;
using System;
using System.Collections.Generic;

namespace cornercutter.ModFeature.ModSetting
{
    class AllowedSources
    {
        public static readonly List<CallerInfo> HealthGain = new List<CallerInfo>()
        {
            new CallerInfo("HealFromRetaliation", "HandleKillEvent"),
            new CallerInfo("LowChanceToHealOnKill", "OnKill"),
            // Not sure what actually triggers this in-game - a skill that heals you when you pick up money? Cut content?
            new CallerInfo("PayToLive", "HandleEvent")
        };

        public static readonly List<CallerInfo> ArmourGain = new List<CallerInfo>()
        {
            new CallerInfo("BreakingArmorFreezesEveryone", "OnApplied"),
            new CallerInfo("BreakingEnemyArmorGrantsArmor", "HandleArmorBroken"),
            new CallerInfo("BuyingEarnsArmor", "HandleEntBought"),
            new CallerInfo("EatingPhonesGainsArmor", "HandleItemGrabbed"),
            new CallerInfo("OverhealingGrantsArmor", "HandleHeal"),
            new CallerInfo("TurnHeartIntoArmor", "GrantArmor")
        };
    }

    [HarmonyPatch(typeof(Entity), nameof(Entity.Heal))]
    class HealBlocker
    {
        static bool Prefix(ref Entity __instance, ref bool __result)
        {
            if (!(__instance is Player)) return true;

            bool isAllowed = CallerInfo.IsAllowed(ConfigOptions.DisableHealing, AllowedSources.HealthGain, 1);
            if (!isAllowed) __result = false; // Calling methods won't register a heal
            return isAllowed;
        }
    }

    [HarmonyPatch(typeof(Entity), nameof(Entity.GainHealth))]
    class GainHealthBlocker
    {
        static bool Prefix(ref Entity __instance)
        {
            if (!(__instance is Player)) return true;
            return CallerInfo.IsAllowed(ConfigOptions.DisableHealing, AllowedSources.HealthGain, 1);
        }
    }

    [HarmonyPatch(typeof(Player), nameof(Player.GainArmor))]
    class GainArmourBlocker
    {
        static bool Prefix()
        {
            return CallerInfo.IsAllowed(ConfigOptions.DisableHealing, AllowedSources.ArmourGain, 1);
        }
    }

    [HarmonyPatch(typeof(AudioManager), nameof(AudioManager.PlayOneShot), new Type[] { typeof(string) })]
    class ConsumeSoundBlocker
    {
        static void Prefix(ref string path)
        {
            CutterConfig cornercutter = CutterConfig.Instance;
            ConfigOptions options = cornercutter.ConfigOptions;

            bool modEnabled = cornercutter.CornercutterIsEnabled() && cornercutter.ModIsActive();
            if (!(modEnabled && options.HasFlag(ConfigOptions.DisableHealing))) return;
            cornercutter.LogDebug("Sound path registering as " + path);

            if (path == "Consume_Food" || path == "Consume_Drink")
            {
                path = "App_CantUse";
            }
        }
    }
}
