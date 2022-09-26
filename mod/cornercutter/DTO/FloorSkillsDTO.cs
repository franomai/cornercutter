using Newtonsoft.Json;

namespace cornercutter.DTO
{
    class FloorSkillsDTO
    {
        [JsonProperty("allFloors")]
        public RoomSkillsDTO AllFloors { get; set; }
        [JsonProperty("firstFloor")]
        public RoomSkillsDTO FirstFloor { get; set; }
        [JsonProperty("secondFloor")]
        public RoomSkillsDTO SecondFloor { get; set; }
        [JsonProperty("thirdFloor")]
        public RoomSkillsDTO ThirdFloor { get; set; }
        [JsonProperty("boss")]
        public RoomSkillsDTO Boss { get; set; }
    }
}
