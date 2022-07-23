using System;
using System.Collections.Generic;
using System.Text;

namespace cornercutter
{
    abstract class SpawnCollection
    {
        public List<WeightedSkill> Skills { get; protected set; }

        public SpawnCollection()
        {
            Skills = new List<WeightedSkill>();
        }

        public virtual void AddSkill(WeightedSkill skill)
        {
            Skills.Add(skill);
        }

        public void AddSkills(params WeightedSkill[] skills)
        {
            foreach (WeightedSkill skill in skills)
            {
                AddSkill(skill);
            }
        }

        public abstract Entity GetNextSkill();
    }
}
