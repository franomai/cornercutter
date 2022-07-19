import { Box } from '@chakra-ui/react';
import { CSSProperties, forwardRef, ForwardRefRenderFunction } from 'react';
import { Item } from '../../types/ItemTypes';

interface Props {
    item: Item;
    style?: CSSProperties;
}

const Skill: ForwardRefRenderFunction<HTMLDivElement, Props> = (props, ref) => {
    return (
        <Box px={4} py={1} ref={ref} style={props.style}>
            {props.item.name}
        </Box>
    );
};

export default forwardRef(Skill);
