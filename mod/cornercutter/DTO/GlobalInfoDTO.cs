using cornercutter.Enum;
using Newtonsoft.Json;

namespace cornercutter.DTO
{
    class GlobalInfoDTO
    {
        [JsonProperty("currentMod")]
        public string CurrentModFilename { get; set; }
        [JsonProperty("globalOptions")]
        public GlobalOptions GlobalOptions { get; set; }
    }
}
