using cornercutter.Enum;
using cornercutter.ModLoader;
using HarmonyLib;
using System.Collections.Generic;
using System.Linq;

namespace cornercutter.ModFeature.ModSetting
{
    [HarmonyPatch(typeof(MultiSpawner), nameof(MultiSpawner.Spawn))]
    class MultiSpawnerSwapper
    {
        static void Prefix(ref MultiSpawner __instance)
        {
            if (!CutterConfig.Instance.CornercutterIsEnabled()) return;

            MultiSpawnerType multiSpawnerType = CutterConfig.Instance.MultiSpawnerType;
            List<EntitySpawner> spawners = __instance.subSpawners;
            int[] spawnerWeights = __instance.subSpawnerWeights;

            int totalWeight = 0;
            int[] newWeights = new int[spawnerWeights.Length];

            for (int i = 0; i < spawners.Count; i++)
            {
                EntitySpawner spawner = spawners[i];
                if (spawner)
                {
                    int originalWeight = spawnerWeights[i];
                    int newWeight;

                    switch (multiSpawnerType)
                    {
                        case MultiSpawnerType.AlwaysSkillIfAble:
                            newWeight = spawner.name == "SkillSpawn" ? originalWeight : 0;
                            break;
                        case MultiSpawnerType.Never:
                            newWeight = spawner.name == "SkillSpawn" ? 0 : originalWeight;
                            break;
                        default:
                            newWeight = originalWeight;
                            break;
                    }

                    newWeights[i] = newWeight;
                    totalWeight += newWeight;
                }
            }

            // If we looked at everything and now nothing can be spawned, leave the original weights.
            if (totalWeight != 0)
            {
                __instance.subSpawnerWeights = newWeights;
            }

        }
    }
}
