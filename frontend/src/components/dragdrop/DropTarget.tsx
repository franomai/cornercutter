import { Box } from '@chakra-ui/react';
import { FC, ReactNode, useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import { ItemType, Item } from '../../types/ItemTypes';
import Skill from './Skill';

interface Props {
    itemType: ItemType;
    onItemDropped: (dragItem: string) => void;
}

interface DropProps {
    isOver: boolean;
    canDrop: boolean;
}

const DropZone: FC<Props> = (props) => {
    const [item, setItem] = useState<Item | null>(null);

    const [{ isOver, canDrop }, dropRef] = useDrop<Item, unknown, DropProps>(() => ({
        accept: props.itemType,
        drop: (item) => setItem(item),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }));

    return (
        <Box
            ref={dropRef}
            border="1px dashed"
            p={5}
            borderColor={isOver ? 'orange.200' : canDrop ? 'teal.200' : undefined}
        >
            {item ? <Skill id={item.id} name={item.name} /> : 'Drop stuff here!'}
        </Box>
    );
};

export default DropZone;
