using System;
using System.Collections.Generic;
using System.Text;

namespace cornercutter
{
    class WeightedSpawnCollection : SpawnCollection
    {
        private int currentTotal;
        private readonly Random rng;

        public WeightedSpawnCollection()
        {
            currentTotal = 0;
            rng = new Random();
        }

        public override void AddSkill(WeightedSkill skill)
        {
            base.AddSkill(skill);
            currentTotal += skill.Weight;
        }

        public override Entity GetNextSkill()
        {
            Entity selectedSkill = null;
            // Roll the dice for the item - pick a weight, then find the item in the right weight range
            int selectedWeight = rng.Next(0, currentTotal);
            int rollingWeight = 0;
            foreach (WeightedSkill weightedSkill in Skills)
            {
                rollingWeight += weightedSkill.Weight;
                if (rollingWeight > selectedWeight)
                {
                    selectedSkill = weightedSkill.Skill;
                    break;
                }
            }
            return selectedSkill;
        }
    }
}
