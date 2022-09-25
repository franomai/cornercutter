using Newtonsoft.Json;

namespace cornercutter.DTO
{
    class WeightedSkillDTO
    {
        [JsonProperty("id")]
        public int SkillId { get; set; }
        [JsonProperty("weight")]
        public int SkillWeight { get; set; }
    }
}
