using System;
using System.Collections.Generic;
using System.Text;

namespace cornercutter
{
    class SpawnCollection
    {
        public List<WeightedSkill> Skills { get; private set; }
        // Boolean for whether we should wrap around when pulling this pool or treat it as a bucket to grab from
        private readonly bool isLooping;
        // For now, where isLooping is set, currentIndex is used, otherwise currentTotal for weight tracking
        // Seperated for clarity
        private int currentIndex;
        private int currentTotal;
        private readonly Random rng;

        public SpawnCollection(bool loopSpawns)
        {
            Skills = new List<WeightedSkill>();
            currentIndex = 0;
            isLooping = loopSpawns;
            if (isLooping)
            {
                // Only instantiate if needed
                rng = new Random();
            }
        }

        public void AddSkill(WeightedSkill skill)
        {
            Skills.Add(skill);
            if (isLooping)
            {
                currentTotal += skill.Weight;
            }
        }

        public void AddSkills(params WeightedSkill[] skills)
        {
            foreach (WeightedSkill skill in skills)
            {
                AddSkill(skill);
            }
        }

        public Entity GetNextSkill()
        {
            if (Skills.Count == 0) return null;

            Entity selectedSkill = null;
            if (isLooping)
            {
                // Take the current index item
                selectedSkill = Skills[currentIndex].Skill;
                currentIndex = currentIndex == Skills.Count - 1 ? 0 : currentIndex + 1;
            }
            else
            {
                // Roll the dice for the item - pick a weight, then find the item in the right weight range
                int selectedWeight = rng.Next(0, currentTotal);
                int rollingWeight = 0;
                foreach (WeightedSkill weightedSkill in Skills)
                {
                    int newWeight = rollingWeight + weightedSkill.Weight;
                    if (newWeight > selectedWeight)
                    {
                        selectedSkill = weightedSkill.Skill;
                        break;
                    }
                    rollingWeight = newWeight;
                }
            }
            return selectedSkill;
        }
    }
}
