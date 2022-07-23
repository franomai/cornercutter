using System;
using System.Collections.Generic;
using System.Text;

namespace cornercutter
{
    abstract class SpawnCollection
    {
        public abstract void AddSkill(WeightedSkill skill);

        public void AddSkills(params WeightedSkill[] skills)
        {
            foreach (WeightedSkill skill in skills)
            {
                AddSkill(skill);
            }
        }

        public abstract Entity GetNextSkill();

        public abstract List<WeightedSkill> GetAllSkills();
    }
}
