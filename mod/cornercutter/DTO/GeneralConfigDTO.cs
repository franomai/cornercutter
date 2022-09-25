using cornercutter.Enum;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace cornercutter.DTO
{
    class GeneralConfigDTO
    {
        [JsonProperty("spawns")]
        public SpawnCollectionType SpawnCollectionType { get; set; }
        [JsonProperty("curse_spawns")]
        public CurseSpawnType CurseSpawnType { get; set; }
        [JsonProperty("global_options")]
        public GlobalOptions GlobalOptions { get; set; }
        [JsonProperty("options")]
        public ConfigOptions ConfigOptions { get; set; }
        [JsonProperty("starting_skills")]
        public List<WeightedSkillDTO> StartingSkills { get; set; }
    }
}
