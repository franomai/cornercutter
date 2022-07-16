import { FC } from 'react';
import { useDrag } from 'react-dnd';
import { Item } from '../../types/ItemTypes';
import { ItemTypes } from '../ItemTypeDefinitions';
import ItemRender from './ItemRender';

interface Props {
    item: Item;
}

const Skill: FC<Props> = (props) => {
    const [, dragRef] = useDrag(() => ({
        type: ItemTypes.SKILL.id,
        item: props.item,
    }));

    return <ItemRender ref={dragRef} item={props.item} style={{ cursor: 'move' }} />;
};

export default Skill;
