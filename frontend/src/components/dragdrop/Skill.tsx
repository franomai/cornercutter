import { Box } from '@chakra-ui/react';
import { FC, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';

interface DropResult {
    name: string;
}

interface Props {
    id: string;
    name: string;
}

const Skill: FC<Props> = (props) => {
    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: ItemTypes.SKILL,
        item: props,
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult<DropResult>();
            console.log(`End! ${item} ${dropResult}`);
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    useEffect(() => {
        console.log('Dragging', props.name, ':', isDragging);
    }, [isDragging]);

    return (
        <Box px={4} py={1} ref={dragRef} style={{ cursor: 'move' }}>
            {props.name}
        </Box>
    );
};

export default Skill;
