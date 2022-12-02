using cornercutter.Enum;
using cornercutter.ModLoader;
using HarmonyLib;
using System;
using System.Collections.Generic;
using System.Text;

namespace cornercutter.ModFeature.GlobalSetting
{
    [HarmonyPatch(typeof(CubitShop), nameof(CubitShop.GetAvailableSkills))]
    class EnsureAlwaysFiveCubitShopOptions
    {
        static int currentSkillIndex = 0;

        static bool Prefix(ref List<Entity> __result, ref CubitShop __instance)
        {
            CutterConfig cornercutter = CutterConfig.Instance;
            GlobalOptions globals = cornercutter.GlobalOptions;
            if (!(cornercutter.CornercutterIsEnabled()
                && globals.HasFlag(GlobalOptions.EnsureAlwaysFiveCubitShopOptions))) return true;

            // This method is called when we first create the shop, so we need to reset it each time
            currentSkillIndex = 0;
            List<Entity> skillsToSell = new List<Entity>();
            for (int i = 0; i < CubitShop.SKILL_COUNT; i++)
            {
                Entity skillToSell = GetNextSkill();
                if (skillToSell == null)
                {
                    break;
                }
                skillsToSell.Add(skillToSell);
            }
            __result = skillsToSell;
            return false;
        }

        public static Entity GetNextSkill()
        {
            // This can be called via the original instantiate of the shop or on a restock
            for (; currentSkillIndex < ProgressionSettings.settings.mainSkillPool.pool.Count; currentSkillIndex++)
            {
                Entity skillEntity = ProgressionSettings.settings.mainSkillPool.pool[currentSkillIndex];
                Skill skillComponent = skillEntity.GetComponentInChildren<Skill>();
                if (skillComponent)
                {
                    if (!SaveData.instance.SkillPurchased(skillComponent.objectName))
                    {
                        currentSkillIndex++; // Start the next call one further ahead
                        return skillEntity;
                    }
                }
            }
            return null;
        }
    }

    [HarmonyPatch(typeof(CubitShopEntity), nameof(CubitShopEntity.OnGrabbed))]
    class CubitRestocker
    {
        // Unfortunately the base call contains a destroy on our Entity
        // This causes a lot of downstream problems, and means to do a true swap
        // we would have to find this spawner (through the parent), clone the relevant parts, and then replace it
        // As such, it is much cleaner to just clone the relevant OG code and edit in our swap as per below

        static bool Prefix(ref CubitShopEntity __instance)
        {
            CutterConfig cornercutter = CutterConfig.Instance;
            GlobalOptions globals = cornercutter.GlobalOptions;
            if (!(cornercutter.CornercutterIsEnabled()
                && globals.HasFlag(GlobalOptions.EnsureAlwaysFiveCubitShopOptions))) return true;


            // Original skill purchase code
            Player.singlePlayer.data.ChangeCubits(-__instance.CurrentCost());
            SaveData.instance.SetInt("cubits", PlayerData.instance.cubits);
            AudioManager.PlayOneShot("Buy_Item");
            __instance.purchasableEntity.forSale = false;
            __instance.purchasableEntity.ParentToCurrentRoom(null);
            Player.singlePlayer.GrabItem(__instance.purchasableEntity);
            ModPickup modPickup = __instance.purchasableEntity as ModPickup;
            if (modPickup)
            {
                SaveData.instance.UnlockSkill(modPickup.mod.objectName);
            }
            AchievementManager.CheckBoughtSkills();
            ParticleManager.instance.PlayPoof(__instance.transform.position);
            SaveLoad.SaveGame();

            Entity nextSkill = EnsureAlwaysFiveCubitShopOptions.GetNextSkill();
            if (nextSkill != null)
            {
                // As well as swapping the item, recreate the GUI with the new info
                GUIManager.instance.skillPrompt.Close();

                __instance.InitilizeCubitShop(nextSkill.gameObject.GetComponent<Entity>(),
                    ProgressionSettings.settings.GetCubitPrice(nextSkill.GetComponentInChildren<Skill>()
                ));

                GUIManager.instance.skillPrompt.Open(__instance as ShopEntity);
            }
            else
            {
                __instance.price.enabled = false;
                UnityEngine.Object.Destroy(__instance.gameObject);
            }
            return false;
        }
    }

    [HarmonyPatch(typeof(ProgressionSettings), nameof(ProgressionSettings.GetCubitPrice))]
    class FreeCubitShop
    {
        static bool Prefix(ref int __result)
        {
            CutterConfig cornercutter = CutterConfig.Instance;
            GlobalOptions globals = cornercutter.GlobalOptions;
            if (!(cornercutter.CornercutterIsEnabled()
                && globals.HasFlag(GlobalOptions.EnableFreeCubitShop))) return true;

            __result = 0;
            return false;
        }
    }
}
