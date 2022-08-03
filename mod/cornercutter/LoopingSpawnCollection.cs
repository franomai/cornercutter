using System;
using System.Collections.Generic;
using System.Text;

namespace cornercutter
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
            Entity selectedSkill = Skills[currentIndex].Skill;
            // Set the index to the next index, wrapping around where necessary
            currentIndex = (currentIndex + 1) % Skills.Count;
            return selectedSkill;
        }
    }
}
