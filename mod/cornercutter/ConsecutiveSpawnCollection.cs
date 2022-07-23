using System;
using System.Collections.Generic;
using System.Text;

namespace cornercutter
{
    class ConsecutiveSpawnCollection : SpawnCollection
    {
        private List<WeightedSkill> Skills { get; set; }
        private int currentIndex;

        public ConsecutiveSpawnCollection()
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
            if (Skills.Count <= currentIndex) return null;
            return Skills[currentIndex++].Skill;
        }
    }
}
