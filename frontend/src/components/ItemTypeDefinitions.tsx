import { ItemType } from '../types/ItemTypes';
import Skill from './dragdrop/Skill';

export const ItemTypes: Record<string, ItemType> = {
    SKILL: {
        id: 'skill',
        render: (item) => <Skill id={item.id} name={item.name} />,
    },
};
