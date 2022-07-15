import Skill from '../components/dragdrop/Skill';
import SearchColumnItem from '../types/SearchColumnItem';

export const Skills: SearchColumnItem[] = [
    {
        id: '1',
        name: 'Action-Oriented',
    },
    {
        id: '2',
        name: 'Aggressive',
    },
    {
        id: '3',
        name: 'Agile',
    },
    {
        id: '4',
        name: "Aggro Crab's Blessing",
    },
].map((skill) => ({
    id: skill.id,
    name: skill.name,
    render: <Skill item={skill} />,
}));
