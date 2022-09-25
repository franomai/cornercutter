namespace cornercutter.ModFeature.SpawnOverride.CollectionTypes
{
    class LoopingSpawnCollection : SpawnCollection
    {
        private int currentIndex;

        public LoopingSpawnCollection()
        {
            currentIndex = 0;
        }

        public override Entity GetNextSkill()
        {
            if (Skills.Count == 0) return null;
            Entity selectedSkill = Skills[currentIndex].Skill;
            // Set the index to the next index, wrapping around where necessary
            currentIndex = (currentIndex + 1) % Skills.Count;
            return selectedSkill;
        }
    }
}
