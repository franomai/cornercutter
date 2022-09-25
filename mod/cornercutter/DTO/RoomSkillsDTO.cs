using Newtonsoft.Json;
using System.Collections.Generic;

namespace cornercutter.DTO
{
    class RoomSkillsDTO
    {
        [JsonProperty("all")]
        public List<WeightedSkillDTO> AllSkills { get; set; }
        [JsonProperty("free")]
        public List<WeightedSkillDTO> FreeSkills { get; set; }
        [JsonProperty("shop")]
        public List<WeightedSkillDTO> ShopSkills { get; set; }
        [JsonProperty("curse")]
        public List<WeightedSkillDTO> CurseSkills { get; set; }
        [JsonProperty("finale")]
        public List<WeightedSkillDTO> FinaleSkills { get; set; }
    }
}
