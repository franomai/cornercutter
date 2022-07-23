using System;
using System.Collections.Generic;
using System.Text;

namespace cornercutter
{
    class LoopingSpawnCollection : SpawnCollection
    {
        private List<WeightedSkill> Skills { get; set; }
        private int currentIndex;

        public LoopingSpawnCollection()
        {
            Skills = new List<WeightedSkill>(); ;
            currentIndex = 0;
        }

        public override void AddSkill(WeightedSkill skill)
        {
            Skills.Add(skill);
        }

        public override List<WeightedSkill> GetAllSkills()
        {
            return Skills;
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
