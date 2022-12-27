using cornercutter.ModLoader;
using HarmonyLib;
using System;

using static cornercutter.ModFeature.SpecialMods.ModNames;

namespace cornercutter.ModFeature.SpecialMods.CornercutterChristmas
{
    [HarmonyPatch(typeof(BackupSkill), "OnApplied")]
    class GiftOnApplied
    {
        static bool Prefix(ref BackupSkill __instance)
        {
            CutterConfig cornercutter = CutterConfig.Instance;
            bool isChristmas = cornercutter.CornercutterIsEnabled() && cornercutter.ModIsActive()
                && GetModFromName(cornercutter.ModName) == SpecialMod.CornercutterChristmas;
            int giftId = __instance.pointCost;
            if (!isChristmas)
            {
                if (giftId != 0)
                {
                    __instance.pointCost = 0;
                    ModPickup pickup = GlobalSettings.defaults.fallbackSkill.GetComponent<ModPickup>();
                    EntityMod mod = pickup.mod;
                    mod.pointCost = 0;
                    cornercutter.LogDebug("Reset gift successfully!");
                }
                return true;
            }

            try
            {
                cornercutter.LogDebug("Applying gift effect ...");
                // Returns if applying was successful - if so, don't run the normal gift logic
                return !GiftHandler.ApplyGiftEffect(giftId, __instance);
            }
            catch (Exception e)
            {
                cornercutter.LogError("Something went wrong applying the gift effect:");
                cornercutter.LogError(e);
                return true;
            }
        }
    }

    [HarmonyPatch(typeof(BackupSkill), "OnRemoved")]
    class GiftOnRemoved
    {
        static void Prefix(ref BackupSkill __instance)
        {
            CutterConfig cornercutter = CutterConfig.Instance;
            int giftId = __instance.pointCost;
            // We can't check the mod state here because they may have updated cc while in the dungeon,
            // so it is better to check if the gift is a christmas gift or not
            bool isChristmasGift = giftId != 0;
            if (!isChristmasGift) return;

            try
            {
                cornercutter.LogDebug("Removing gift effect ...");
                GiftHandler.RemoveGiftEffect(giftId, __instance);
                // Gifts are oneshots so we don't have to cancel the base call
            }
            catch (Exception e)
            {
                cornercutter.LogError("Something went wrong removing the gift effect:");
                cornercutter.LogError(e);
            }
        }
    }

    [HarmonyPatch(typeof(BackupSkill), "InitializeListeners")]
    class InitializeGiftListeners
    {
        static void Prefix(ref BackupSkill __instance)
        {
            CutterConfig cornercutter = CutterConfig.Instance;
            bool isChristmas = cornercutter.CornercutterIsEnabled() && cornercutter.ModIsActive()
                && GetModFromName(cornercutter.ModName) == SpecialMod.CornercutterChristmas;
            if (!isChristmas) return;

            try
            {
                int giftId = __instance.pointCost;
                cornercutter.LogDebug("Adding gift listener ...");
                GiftHandler.InitializeGiftListeners(giftId, __instance);
                // Gifts don't add listeners so we don't have to cancel the base call
            }
            catch (Exception e)
            {
                cornercutter.LogError("Something went wrong adding the gift listener:");
                cornercutter.LogError(e);
            }
        }
    }

    [HarmonyPatch(typeof(BackupSkill), "RemoveListeners")]
    class RemoveGiftListeners
    {
        static void Prefix(ref BackupSkill __instance)
        {
            CutterConfig cornercutter = CutterConfig.Instance;
            int giftId = __instance.pointCost;
            // We can't check the mod state here because they may have updated cc while in the dungeon,
            // so it is better to check if the gift is a christmas gift or not
            bool isChristmasGift = giftId != 0;
            if (!isChristmasGift) return;

            try
            {
                cornercutter.LogDebug("Removing gift listeners ...");
                GiftHandler.RemoveGiftListeners(giftId, __instance);
            }
            catch (Exception e)
            {
                cornercutter.LogError("Something went wrong removing the gift listener:");
                cornercutter.LogError(e);
            }
        }
    }
}
