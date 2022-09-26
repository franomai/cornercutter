using BepInEx.Logging;
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

        private string ModFileLocation;
        public GlobalOptions GlobalOptions { get; private set; }

        public SpawnCollectionType SpawnCollectionType { get; private set; }
        public CurseSpawnType CurseSpawnType { get; private set; }
        
        public ConfigOptions ConfigOptions { get; private set; }
        public WeightedSkill[] StartingSkills { get; private set; }
        private Dictionary<Floor, FloorConfig> floorConfigs;

        private ManualLogSource Logger = null;
        private ModReader Reader = new ModReader();

        private CutterConfig()
        {
        }

        public void Setup(ManualLogSource logger)
        {
            Logger = logger;
            ClearConfig();
            LoadGlobalSettings();
        }

        public void LogInfo(object data) { if (Logger == null) return; Logger.LogInfo(data); }
        public void LogError(object data) { if (Logger == null) return; Logger.LogError(data); }
        public void LogDebug(object data)
        {
            if (Logger == null) return;
            if (!GlobalOptions.HasFlag(GlobalOptions.EnableExtraLogging)) return;
            Logger.LogDebug(data);
        }

        public void LoadGlobalSettings()
        {
            string modInstallLocation = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            string cornercutterFolder = Path.Combine(modInstallLocation, @"..\..\cornercutter");
            string settingsLocation = Path.GetFullPath(Path.Combine(cornercutterFolder, "settings.json"));
            GlobalInfoDTO settings = Reader.ReadGlobalInfo(settingsLocation);
            GlobalOptions = settings.GlobalOptions;
            ModFileLocation = Path.GetFullPath(Path.Combine(cornercutterFolder, @"mods\" + settings.CurrentModFilename));
        }

        public void LoadCurrentConfig()
        {
            ClearConfig();
            LoadGlobalSettings();

            ModConfigDTO config = Reader.ReadMod(ModFileLocation);
            SpawnCollectionType = config.GeneralConfig.SpawnCollectionType;
            CurseSpawnType = config.GeneralConfig.CurseSpawnType;
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
            ModFileLocation = null;
            GlobalOptions = GlobalOptions.NoneSelected;

            SpawnCollectionType = SpawnCollectionType.NoneSelected;
            CurseSpawnType = CurseSpawnType.NoneSelected;
            ConfigOptions = ConfigOptions.NoneSelected;
            StartingSkills = new WeightedSkill[] {};
            floorConfigs = new Dictionary<Floor, FloorConfig>();
        }

        // Utility method to eject out if we can't load the current config
        public void ShutdownCornercutter()
        {
            ClearConfig();
            GlobalOptions = GlobalOptions.DisableCornercutter;
        }

        // Adding as a utility method here, given it is called in most features
        public bool CornercutterIsEnabled()
        {
            return !GlobalOptions.HasFlag(GlobalOptions.DisableCornercutter);
        }
    }
}
