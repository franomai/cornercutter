using Newtonsoft.Json;

namespace cornercutter.DTO
{
    class FloorSkillsDTO
    {
        [JsonProperty("all_floors")]
        public RoomSkillsDTO AllFloors { get; set; }
        [JsonProperty("first_floor")]
        public RoomSkillsDTO FirstFloor { get; set; }
        [JsonProperty("second_floor")]
        public RoomSkillsDTO SecondFloor { get; set; }
        [JsonProperty("third_floor")]
        public RoomSkillsDTO ThirdFloor { get; set; }
        [JsonProperty("boss")]
        public RoomSkillsDTO Boss { get; set; }
    }
}
