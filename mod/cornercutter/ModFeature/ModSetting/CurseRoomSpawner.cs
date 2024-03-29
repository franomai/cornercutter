﻿using cornercutter.Enum;
using cornercutter.ModLoader;
using HarmonyLib;

namespace cornercutter.ModFeature.ModSetting
{
    [HarmonyPatch(typeof(DungeonSettings), "get_specialShopChance")]
    class CurseRoomSpawner
    {
        // This method modifies the "specialShopChance" getter, which usually changes based on floor
        // TODO: Check if the percentage change has a downstream effect
        // AFAIK, this is only referenced in one spot (dungeon generation for curse rooms)
        static void Postfix(ref float __result)
        {
            CutterConfig cornercutter = CutterConfig.Instance;
            if (!(cornercutter.CornercutterIsEnabled() && cornercutter.ModIsActive())) return;

            CurseSpawnType curseSpawnType = cornercutter.CurseSpawnType;
            switch (curseSpawnType)
            {
                case CurseSpawnType.Always:
                    __result = 1f;
                    break;
                // If there is any chance to spawn it, force it to spawn, otherwise don't
                // This stops the curse room spawning in floors it shouldn't, like the boss floor
                case CurseSpawnType.AlwaysIfAble:
                    __result = __result > 0f ? 1f : 0f;
                    break;
                case CurseSpawnType.Never:
                    __result = 0f;
                    break;
                default:
                    break;
            }
        }
    }
}
