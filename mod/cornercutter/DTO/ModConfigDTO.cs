using Newtonsoft.Json;

namespace cornercutter.DTO
{
    class ModConfigDTO
    {
        [JsonProperty("info")]
        public ModInfoDTO ModInfo { get; set; }
        [JsonProperty("general")]
        public GeneralConfigDTO GeneralConfig { get; set; }
        [JsonProperty("floorSkills")]
        public FloorSkillsDTO FloorSkills { get; set; }
    }
}
