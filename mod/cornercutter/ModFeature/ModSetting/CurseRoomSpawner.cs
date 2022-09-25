using cornercutter.Enum;
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
            if (!CutterConfig.Instance.CornercutterIsEnabled()) return;

            CurseSpawnType curseSpawnType = CutterConfig.Instance.CurseSpawnType;
            switch (curseSpawnType)
            {
                case CurseSpawnType.Always:
                    __result = 1f;
                    break;
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
