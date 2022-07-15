import { Box } from '@chakra-ui/react';
import { FC } from 'react';
import { useDrag } from 'react-dnd';
import { Item } from '../../types/ItemTypes';
import { ItemTypes } from '../ItemTypeDefinitions';

const Skill: FC<Item> = (props) => {
    const [, dragRef] = useDrag(() => ({
        type: ItemTypes.SKILL.id,
        item: props,
    }));

    return (
        <Box px={4} py={1} ref={dragRef} style={{ cursor: 'move' }}>
            {props.name}
        </Box>
    );
};

export default Skill;
