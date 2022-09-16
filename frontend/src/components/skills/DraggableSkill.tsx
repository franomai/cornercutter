import { FC } from 'react';
import { useDrag } from 'react-dnd';
import { Item, ItemType } from '../../types/ItemTypes';
import Skill from './ItemRender';

interface Props {
    item: Item;
}

const DraggableSkill: FC<Props> = (props) => {
    const [, dragRef] = useDrag(() => ({
        type: ItemType.SKILL,
        item: props.item,
    }));

    return <Skill ref={dragRef} item={props.item} style={{ cursor: 'move' }} />;
};

export default DraggableSkill;
