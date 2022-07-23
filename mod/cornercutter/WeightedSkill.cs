using System;
using System.Collections.Generic;
using System.Text;

namespace cornercutter
{
    class WeightedSkill
    {
        public Entity Skill { get; private set; }
        public int Weight { get; private set; }

        // Use a weight of 1 where no weight is specified
        // As such, if nothing has a weight attached, all items will be considered equal
        public WeightedSkill(Entity skill, int weight = 1)
        {
            Skill = skill;
            Weight = weight;
        }
    }
}
