using cornercutter.Enum;
using cornercutter.ModLoader;
using HarmonyLib;
using System;
using System.Linq;
using UnityEngine;

namespace cornercutter.ModFeature.ModSetting
{
    [HarmonyPatch(typeof(SkillSpawner), nameof(SkillSpawner.Spawn))]
    class GiftOfTheInternBlocker
    {
        static void Prefix(ref GameObject __state)
        {
            ConfigOptions options = CutterConfig.Instance.ConfigOptions;
            if (CutterConfig.Instance.CornercutterIsEnabled()
                && options.HasFlag(ConfigOptions.DisableGiftOfIntern))
            {
                __state = GlobalSettings.defaults.fallbackSkill;
                GlobalSettings.defaults.fallbackSkill = null;
            }
        }

        static void Postfix(GameObject __state)
        {
            if (__state != null)
            {
                GlobalSettings.defaults.fallbackSkill = __state;
            }
        }
    }

    [HarmonyPatch(typeof(SwompShoplift), "Shoplift")]
    class SwompliftBlocker
    {
        static bool Prefix(ref SwompShoplift __instance)
        {
            ConfigOptions options = CutterConfig.Instance.ConfigOptions;
            if (CutterConfig.Instance.CornercutterIsEnabled()
                && options.HasFlag(ConfigOptions.DisableGiftOfIntern))
            {
                // shopEntities referenced in the OG method is private so we have to recreate the same collection here
                ShopEntity[] entities = (from e in DungeonManager.currentRoom.GetComponentsInChildren<ShopEntity>()
                                         where !(e is StyxToCashKiosk) && !(e is RayRerollShopKiosk) && !(e is TappiSubscriptionKiosk)
                                         select e).ToArray<ShopEntity>();
                Console.WriteLine(entities.Length);
                if (entities.Length == 0)
                {
                    AudioManager.PlayOneShot("App_CantUse");
                    UnityEngine.Object.Destroy(__instance);
                    return false;
                }
            }
            return true;
        }

    }
}
