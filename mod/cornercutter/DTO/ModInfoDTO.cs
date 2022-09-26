using Newtonsoft.Json;

namespace cornercutter.DTO
{
    class ModInfoDTO
    {
        [JsonProperty("name")]
        public string Name { get; set; }
        [JsonProperty("description")]
        public string Description { get; set; }
    }
}
