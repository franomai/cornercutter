import { Box } from '@chakra-ui/react';
import { FC, ReactNode, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';

interface Props {
    id: string;
    name: string;
}

const Skill: FC<Props> = (props) => {
    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: ItemTypes.SKILL,
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
