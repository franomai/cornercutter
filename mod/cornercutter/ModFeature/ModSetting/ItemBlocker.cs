using cornercutter.Enum;
using cornercutter.ModLoader;
using HarmonyLib;
using System.Collections.Generic;
using System.Diagnostics;

namespace cornercutter.ModFeature.ModSetting
{
    [HarmonyPatch(typeof(Player), nameof(Player.GrabItem))]
    class ItemBlocker
    {
        static readonly List<CallerInfo> SkillsGrantingItems = new List<CallerInfo>()
        {
            new CallerInfo("<StartWithBento>d__8", "MoveNext"),
            new CallerInfo("<SpawnBomb>d__5", "MoveNext")
        };

        static bool Prefix(Entity item, ref bool __result)
        {
            CutterConfig cornercutter = CutterConfig.Instance;
            cornercutter.LogDebug("Adding something to their inventory...");
            if (
                !(
                  item == null ||
                  item is CubitShopEntity ||
                  item is Pickup ||
                  item is ShopEntity ||
                  item is Vehicle ||
                  item.GetComponentInChildren<FizzleCan>() != null
                ) && item.interactable && item.grabbable)
            {
                cornercutter.LogDebug("Standard item picked up, checking if it's allowed...");
                StackTrace stack = null;
                // Check if this is a permitted pickup
                bool isAllowed = CallerInfo.IsAllowed(ConfigOptions.DisableItemPickup, SkillsGrantingItems, ref stack, out CallerInfo caller);

                if (!isAllowed)
                {
                    __result = false; // Calling methods won't register a pickup

                    if (caller != null)
                    {
                        // If this was called from a shop purchase, nuke the item (otherwise it will float in the air)
                        if ((caller.ClassName == "ShopEntity" && caller.MethodName == "OnGrabbed") ||
                        (caller.ClassName == "BackupSkill" && caller.MethodName == "OnApplied"))
                        {
                            UnityEngine.Object.Destroy(item.gameObject);
                            // If this sound is found to be too hilarious, can be replaced with App_CantUse
                            // Do not refactor as a fallthrough as GetCallerInfoFromStack should be run as little as possible
                            AudioManager.PlayOneShot("AvieBoss_Core_Thunder");
                        } else
                        {
                            caller = CallerInfo.GetCallerInfoFromStack(stack, CallerInfo.CALLER_FRAME_NUMBER + 1);
                            bool isRollPickup = (caller != null && caller.ClassName == "Player" && caller.MethodName == "TryDodgeRollGrab");

                            // Don't make the noise if the grab came from a roll (it will fire multiple times and although funny it would get pretty annoying)
                            if (!isRollPickup) {
                                AudioManager.PlayOneShot("App_CantUse");
                            }
                        }
                    }
                }
                return isAllowed;
            }

            cornercutter.LogDebug("Item will be handled properly downstream, skipping...");
            return true;
        }
    }
}
