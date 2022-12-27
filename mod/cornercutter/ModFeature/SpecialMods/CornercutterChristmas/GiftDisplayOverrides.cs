using cornercutter.ModLoader;
using HarmonyLib;

using static cornercutter.ModFeature.SpecialMods.ModNames;

namespace cornercutter.ModFeature.SpecialMods.CornercutterChristmas
{
    [HarmonyPatch(typeof(EntityMod), "get_DisplayName")]
    class GiftNameOverride
    {
        static void Postfix(ref EntityMod __instance, ref string __result)
        {
            if (__instance.name == "Gift of the Intern (Jackie)")
            {
                CutterConfig cornercutter = CutterConfig.Instance;
                bool isChristmas = cornercutter.CornercutterIsEnabled() && cornercutter.ModIsActive()
                    && GetModFromName(cornercutter.ModName) == SpecialMod.CornercutterChristmas;
                if (!isChristmas) return;

                (GiftHandler.GiftType, ChristmasGift) giftInfo = GiftHandler.GetChristmasGiftById(__instance.pointCost);
                ChristmasGift gift = giftInfo.Item2;
                if (gift != null)
                {
                    __result = gift.Name;
                }
            }
        }
    }

    [HarmonyPatch(typeof(EntityMod), "get_description")]
    class GiftDescriptionOverride
    {
        static void Postfix(ref EntityMod __instance, ref string __result)
        {
            if (__instance.name.StartsWith("Gift of the Intern"))
            {
                CutterConfig cornercutter = CutterConfig.Instance;
                bool isChristmas = cornercutter.CornercutterIsEnabled() && cornercutter.ModIsActive()
                    && GetModFromName(cornercutter.ModName) == SpecialMod.CornercutterChristmas;
                if (!isChristmas) return;

                (GiftHandler.GiftType, ChristmasGift) giftInfo = GiftHandler.GetChristmasGiftById(__instance.pointCost);
                ChristmasGift gift = giftInfo.Item2;
                if (gift == null) return;

                if (__instance.name == "Gift of the Intern (Jackie)")
                {
                    __result = gift.Description;
                }
                else
                {
                    __result += " " + gift.VagueDescription;
                }
            }
        }
    }

    [HarmonyPatch(typeof(Entity), "get_DisplayName")]
    class GiftHiddenNameOverride
    {
        static void Postfix(ref Entity __instance, ref string __result)
        {
            // This __result == fallback is to catch cases where the gift is contained inside something
            // else and the name is displaying - for example, the Tappi shop
            // Obviously this is not resilient to language changes however checking all the relevant properties
            // of the Entity is not worth the performance hit / time effort for an edge case
            // and the actual skill prompt is correctly handled by the first part of the check

            if (__instance.name == "BackupSkill" || __result == "Gift of the Intern")
            {
                CutterConfig cornercutter = CutterConfig.Instance;
                bool isChristmas = cornercutter.CornercutterIsEnabled() && cornercutter.ModIsActive()
                    && GetModFromName(cornercutter.ModName) == SpecialMod.CornercutterChristmas;
                if (!isChristmas) return;

                __result = "A very special gift!";
            }
        }
    }
}
