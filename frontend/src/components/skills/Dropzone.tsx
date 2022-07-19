import { Box, Center, Text } from '@chakra-ui/react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Children, FC, ReactNode } from 'react';
import { useDrop } from 'react-dnd';
import { ItemType, Item } from '../../types/ItemTypes';

interface Props {
    itemType: ItemType;
    onItemDropped?: (item: Item) => void;
    children?: ReactNode;
}

interface DropProps {
    canDrop: boolean;
}

const Dropzone: FC<Props> = (props) => {
    const [{ canDrop }, dropRef] = useDrop<Item, unknown, DropProps>(() => ({
        accept: props.itemType.id,
        drop: (item) => {
            if (props.onItemDropped) props.onItemDropped(item);
        },
        collect: (monitor) => ({
            canDrop: monitor.canDrop(),
        }),
    }));

    return (
        <Box
            p={2}
            m={-2}
            ref={dropRef}
            border={canDrop ? '1px dashed' : '1px'}
            borderColor={canDrop ? 'blue.200' : 'transparent'}
            background={canDrop ? 'blackAlpha.300' : undefined}
            rounded="lg"
            w="full"
            h="full"
        >
            {props.children}
        </Box>
    );
};

export default Dropzone;
