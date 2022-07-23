using HarmonyLib;
using System;
using System.Collections.Generic;
using System.Text;

namespace cornercutter
{
    [HarmonyPatch(typeof(FinalRoomBattlePickup), nameof(FinalRoomBattlePickup.OnGrabbed))]
    class FinaleSwapper
    {
        static void Prefix(ref FinalRoomBattlePickup __instance)
        {
            // The spawner used doesn't have any identifying properties so we will use our own to get picked up by PickupSwapper
            __instance.skillSpawner.GetComponentInChildren<SkillSpawner>().name = "FinalRoomBattlePickup";
        }
    }
}
