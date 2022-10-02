using cornercutter.Enum;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace cornercutter.DTO
{
    class GeneralConfigDTO
    {
        [JsonProperty("spawns")]
        public SpawnCollectionType SpawnCollectionType { get; set; }
        [JsonProperty("curseSpawns")]
        public CurseSpawnType CurseSpawnType { get; set; }
        [JsonProperty("options")]
        public ConfigOptions ConfigOptions { get; set; }
        [JsonProperty("startingSkills")]
        public List<WeightedSkillDTO> StartingSkills { get; set; }
    }
}
