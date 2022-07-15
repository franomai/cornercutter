import { Box } from '@chakra-ui/react';
import { FC, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { ItemType, Item } from '../../types/ItemTypes';

const Skill: FC<Item> = (props) => {
    const [, dragRef] = useDrag(() => ({
        type: ItemType.SKILL,
        item: props,
    }));

    return (
        <Box px={4} py={1} ref={dragRef} style={{ cursor: 'move' }}>
            {props.name}
        </Box>
    );
};

export default Skill;
