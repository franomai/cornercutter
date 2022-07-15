import { ItemType } from '../types/ItemTypes';
import ItemRender from './dragdrop/ItemRender';

export const ItemTypes: Record<string, ItemType> = {
    SKILL: {
        id: 'skill',
        render: (item) => <ItemRender item={item} ref={null} />,
    },
};
