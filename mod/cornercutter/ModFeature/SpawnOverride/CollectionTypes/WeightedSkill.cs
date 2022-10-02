namespace cornercutter.ModFeature.SpawnOverride.CollectionTypes
{
    class WeightedSkill
    {
        public Entity Skill { get; private set; }
        public int Weight { get; private set; }

        // Use the UI default weight of 10 if no weight is specified
        // As such, if nothing has a weight attached, all items will be considered equal
        public WeightedSkill(Entity skill, int weight = 10)
        {
            Skill = skill;
            Weight = weight;
        }
    }
}
