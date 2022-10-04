﻿using cornercutter.Enum;
using cornercutter.ModLoader;
using HarmonyLib;
using System;
using System.Collections.Generic;
using System.Text;

namespace cornercutter.ModFeature.ModSetting
{
    [HarmonyPatch(typeof(DungeonManager), "WillSpawnTreasureRoom")]
    class TreasurePedestalSpawner
    {
        static void Postfix(ref DungeonManager __instance, ref bool __result)
        {
            if (!CutterConfig.Instance.CornercutterIsEnabled()) return;

            int currentFloor = __instance.currentFloor + 1;
            PedestalSpawnType pedestalSpawnType = CutterConfig.Instance.PedestalSpawnType;

            switch (pedestalSpawnType)
            {
                case PedestalSpawnType.AlwaysFirstFloor:
                    __result = currentFloor == 1;
                    break;
                case PedestalSpawnType.AlwaysLastFloor:
                    __result = currentFloor == (__instance.isBigRun ? 3 : 8);
                    break;
                case PedestalSpawnType.Never:
                    __result = false;
                    break;
                default:
                    break;
            }
        }
    }
}
