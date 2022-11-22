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
            new CallerInfo { MethodName = "HandleKillEvent", ClassName = "HealFromRetaliation" },
            new CallerInfo { MethodName = "OnKill", ClassName = "LowChanceToHealOnKill" },
            // Not sure what actually triggers this in-game - a skill that heals you when you pick up money? Cut content?
            new CallerInfo { MethodName = "HandleEvent", ClassName = "PayToLive" }
        };

        public static readonly List<CallerInfo> ArmourGain = new List<CallerInfo>()
        {
            new CallerInfo { MethodName = "OnApplied", ClassName = "BreakingArmorFreezesEveryone" },
            new CallerInfo { MethodName = "HandleArmorBroken", ClassName = "BreakingEnemyArmorGrantsArmor" },
            new CallerInfo { MethodName = "HandleEntBought", ClassName = "BuyingEarnsArmor" },
            new CallerInfo { MethodName = "HandleItemGrabbed", ClassName = "EatingPhonesGainsArmor" },
            new CallerInfo { MethodName = "HandleHeal", ClassName = "OverhealingGrantsArmor" },
            new CallerInfo { MethodName = "GrantArmor", ClassName = "TurnHeartIntoArmor" }
        };
    }

    [HarmonyPatch(typeof(Entity), nameof(Entity.Heal))]
    class HealBlocker
    {
        static bool Prefix(ref Entity __instance, ref bool __result)
        {
            if (!(__instance is Player)) return true;

            bool isAllowed = CallerInfo.IsAllowed(ConfigOptions.DisableHealing, AllowedSources.HealthGain);
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
            return CallerInfo.IsAllowed(ConfigOptions.DisableHealing, AllowedSources.HealthGain);
        }
    }

    [HarmonyPatch(typeof(Player), nameof(Player.GainArmor))]
    class GainArmourBlocker
    {
        static bool Prefix()
        {
            return CallerInfo.IsAllowed(ConfigOptions.DisableHealing, AllowedSources.ArmourGain);
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
            // if (!(modEnabled && options.HasFlag(ConfigOptions.DisableHealing))) return true;
            cornercutter.LogDebug("Sound path registering as " + path);

            if (path == "Consume_Food" || path == "Consume_Drink")
            {
                path = "App_CantUse";
            }
        }
    }
}
