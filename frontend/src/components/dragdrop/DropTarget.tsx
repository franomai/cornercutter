import { Box } from '@chakra-ui/react';
import { FC, ReactNode, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';

interface Props {
    children?: ReactNode;
    onItemDropped: (dragItem: string) => void;
}

const DropTarget: FC<Props> = (props) => {
    const [{ isOver, canDrop }, dropRef] = useDrop(() => ({
        accept: ItemTypes.SKILL,
        drop: () => console.log('dropped item!'),
        collect: (monitor) => ({
            isOver: monitor.isOver({ shallow: true }),
            canDrop: monitor.canDrop(),
        }),
        hover: (item) => console.log('Hovering', item),
    }));

    useEffect(() => {
        console.log('is over!', isOver);
    }, [isOver]);

    return (
        <Box
            ref={dropRef}
            border="1px dashed"
            p={5}
            borderColor={isOver ? 'orange.200' : canDrop ? 'teal.200' : undefined}
        >
            {props.children}
        </Box>
    );
};

export default DropTarget;
