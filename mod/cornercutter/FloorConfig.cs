namespace cornercutter
{
    // Enum for floor number, this maps across to the index returned by DungeonManager.currentFloor
    public enum Floor
    {
        AllFloors = 0,
        FirstFloor = 1,
        SecondFloor = 2,
        ThirdFloor = 3,
        Boss = 4,
    }

    class FloorConfig
    {
        public Floor Floor { get; private set; }
        // Spawn pools used by the appropriate swappers

        // StartingSkillSwapper
        public SpawnCollection StartingSkills { get; private set; }
        // PickupSwapper
        public SpawnCollection ShopSkills { get; private set; }
        public SpawnCollection PickupSkills { get; private set; }
        // FinaleSwapper (leveraging PickupSwapper)
        public SpawnCollection FinaleSkills { get; private set; }

        public FloorConfig(Floor floor)
        {
            Floor = floor;
            ConfigOptions options  = CutterConfig.Instance.Options;
            bool loopSpawns = options.HasFlag(ConfigOptions.LoopSpawns);

            // Config option refers to if starting skills should be given for every floor
            // If the collection shouldn't be needed, null it out to make errors more obvious
            bool awardPerLevel = options.HasFlag(ConfigOptions.AwardPerLevel);
            if (floor == Floor.AllFloors || floor == Floor.FirstFloor || awardPerLevel)
            {
                StartingSkills = new SpawnCollection(loopSpawns);
            }
            else
            {
                StartingSkills = null;
            }

            // All floors contain a shop
            ShopSkills = new SpawnCollection(loopSpawns);

            // Boss rooms don't contain free skill rooms (normal or curse) or finales
            if (floor != Floor.Boss)
            {
                PickupSkills = new SpawnCollection(loopSpawns);
                FinaleSkills = new SpawnCollection(loopSpawns);

            }
            else
            {
                PickupSkills = null;
                FinaleSkills = null;
            }
        }
    }
}
