using cornercutter.DTO;
using cornercutter.Enum;
using cornercutter.ModFeature.SpawnOverride.CollectionTypes;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;

namespace cornercutter.ModLoader
{
    class CutterConfig
    {
        public static CutterConfig Instance { get; } = new CutterConfig();
        public SpawnCollectionType SpawnCollectionType { get; private set; } = SpawnCollectionType.None;
        public CurseSpawnType CurseSpawnType { get; private set; } = CurseSpawnType.None;
        public GlobalOptions GlobalOptions { get; private set; } = GlobalOptions.DisableCornercutter;
        public ConfigOptions ConfigOptions { get; private set; } = ConfigOptions.NoneSelected;
        public WeightedSkill[] StartingSkills { get; private set; } = new WeightedSkill[] { };
        private Dictionary<Floor, FloorConfig> floorConfigs = new Dictionary<Floor, FloorConfig>();
        private ModReader Reader = new ModReader();

        private CutterConfig()
        {
        }

        public void LoadCurrentConfig()
        {
            ClearConfig();

            string modInstallLocation = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            string currentModLocation = Path.GetFullPath(Path.Combine(modInstallLocation, @"..\..\cornercutter\current_mod.json"));
            ModConfigDTO config = Reader.ReadMod(currentModLocation);
            SpawnCollectionType = config.GeneralConfig.SpawnCollectionType;
            CurseSpawnType = config.GeneralConfig.CurseSpawnType;
            GlobalOptions = config.GeneralConfig.GlobalOptions;
            ConfigOptions = config.GeneralConfig.ConfigOptions;
            StartingSkills = FetchSkills(config.GeneralConfig.StartingSkills);

            if (ConfigOptions.HasFlag(ConfigOptions.ConfigPerFloor))
            {
                AddFloorConfig(Floor.FirstFloor, config.FloorSkills.FirstFloor);
                AddFloorConfig(Floor.SecondFloor, config.FloorSkills.SecondFloor);
                AddFloorConfig(Floor.ThirdFloor, config.FloorSkills.ThirdFloor);
                AddFloorConfig(Floor.Boss, config.FloorSkills.Boss);
            }
            else
            {
                AddFloorConfig(Floor.AllFloors, config.FloorSkills.AllFloors);
            }
        }

        public void AddFloorConfig(Floor floor, RoomSkillsDTO floorConfig)
        {
            FloorConfig config = new FloorConfig(floor);
            if (ConfigOptions.HasFlag(ConfigOptions.ConfigPerRoom))
            {
                config.FreeSkills.AddSkills(FetchSkills(floorConfig.FreeSkills));
                config.ShopSkills.AddSkills(FetchSkills(floorConfig.ShopSkills));
                config.CurseSkills.AddSkills(FetchSkills(floorConfig.CurseSkills));
                config.FinaleSkills.AddSkills(FetchSkills(floorConfig.FinaleSkills));
            }
            else
            {
                config.AllSkills.AddSkills(FetchSkills(floorConfig.AllSkills));
            }
            floorConfigs.Add(floor, config);
        }

        public WeightedSkill[] FetchSkills(List<WeightedSkillDTO> skills)
        {
            bool respectUnlocks = GlobalOptions.HasFlag(GlobalOptions.RespectUnlocks);
            return skills
                .Select(skill => new WeightedSkill(GameManager.instance.allSkills[skill.SkillId - 1], skill.SkillWeight))
                .Where(skill => !respectUnlocks || SaveData.instance.SkillPurchased(skill.Skill.GetComponentInChildren<Skill>().objectName))
                .ToArray();
        }

        public FloorConfig GetFloorConfig(int floorNumber)
        {
            // Get the config out of the config map for the floor provided
            // If the config is for all floors, ignore the input param and get the generic config instead
            return ConfigOptions.HasFlag(ConfigOptions.ConfigPerFloor)
                ? floorConfigs[(Floor) floorNumber]
                : floorConfigs[Floor.AllFloors];
        }

        public void ClearConfig()
        {
            SpawnCollectionType = SpawnCollectionType.None;
            CurseSpawnType = CurseSpawnType.None;
            GlobalOptions = GlobalOptions.DisableCornercutter;
            ConfigOptions = ConfigOptions.NoneSelected;

            floorConfigs = new Dictionary<Floor, FloorConfig>();
        }

        // Adding as a utility method here, given it is called in most features
        public bool CornercutterIsEnabled()
        {
            return !GlobalOptions.HasFlag(GlobalOptions.DisableCornercutter);
        }
    }
}
