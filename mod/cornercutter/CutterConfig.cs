using System;
using System.Collections.Generic;
using System.Text;

namespace cornercutter
{
    class CutterConfig
    {
        public static CutterConfig Instance { get; } = new CutterConfig();
        public ConfigOptions Options { get; private set; }
        private Dictionary<Floor, FloorConfig> floorConfigs;

        private CutterConfig()
        {
        }

        public void LoadCurrentConfig()
        {
            ClearConfig();
            Options = (ConfigOptions) 3; // This config bitmask "number" will be read in from file

            // For demo purposes, create a dummy all-floors config
            FloorConfig dummyConfig = new FloorConfig(Floor.AllFloors);

            dummyConfig.StartingSkills.AddSkills(new WeightedSkill(
                GameManager.instance.GetSkillPickupByName("FreeHand")
            ), new WeightedSkill(
                GameManager.instance.GetSkillPickupByName("Charismatic")
            ));

            dummyConfig.PickupSkills.AddSkills(new WeightedSkill(
                GameManager.instance.GetSkillPickupByName("FinancialGains")
            ), new WeightedSkill(
                GameManager.instance.GetSkillPickupByName("Intimidating")
            ));

            dummyConfig.ShopSkills.AddSkills(new WeightedSkill(
                GameManager.instance.GetSkillPickupByName("OpenMinded")
            ), new WeightedSkill(
                GameManager.instance.GetSkillPickupByName("Perfectionist")
            ));

            dummyConfig.FinaleSkills.AddSkills(new WeightedSkill(
                GameManager.instance.GetSkillPickupByName("SweatEquity")
            ), new WeightedSkill(
                GameManager.instance.GetSkillPickupByName("TeamPlayer")
            ));


            // Add generated config to the floor config map, to retrieve later
            floorConfigs.Add(Floor.AllFloors, dummyConfig);
        }

        public FloorConfig GetFloorConfig(int floorNumber)
        {
            // Get the config out of the config map for the floor provided
            // If the config is for all floors, ignore the input param and get the generic config instead
            return Options.HasFlag(ConfigOptions.ConfigPerFloor)
                ? floorConfigs[(Floor) floorNumber]
                : floorConfigs[Floor.AllFloors];
        }

        private void ClearConfig()
        {
            // Wipe the config on a fresh load
            Options = ConfigOptions.NoOptionsSelected;
            floorConfigs = new Dictionary<Floor, FloorConfig>();
        }
    }
}
