using System;
using System.Collections.Generic;
using System.Text;

namespace cornercutter
{
    class ConsecutiveSpawnCollection : SpawnCollection
    {
        private int currentIndex;

        public ConsecutiveSpawnCollection()
        {
            currentIndex = 0;
        }

        public override Entity GetNextSkill()
        {
            if (Skills.Count <= currentIndex) return null;
            return Skills[currentIndex++].Skill;
        }
    }
}
