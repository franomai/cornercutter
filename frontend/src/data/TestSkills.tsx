import Skill from '../components/dragdrop/Skill';
import { Item } from '../types/ItemTypes';
import SearchColumnItem from '../types/SearchColumnItem';

const Skills: SearchColumnItem[] = [
    {
        id: 1,
        name: 'Action-Oriented',
    },
    {
        id: 2,
        name: 'Aggressive',
    },
    {
        id: 3,
        name: 'Agile',
    },
    {
        id: 4,
        name: "Aggro Crab's Blessing",
    },
].map((skill) => ({
    id: skill.id,
    name: skill.name,
    render: <Skill item={skill} />,
}));

const mappedSkills = new Map<number, Item>();
Skills.forEach((skill) => mappedSkills.set(skill.id, skill));

function skillFromId(id: number): Item {
    const skill = mappedSkills.get(id);
    if (!skill) {
        // Sanity check - This should never be thrown
        throw new Error(`There is no skill with the id ${id}`);
    }
    return skill;
}

export { Skills, skillFromId };
