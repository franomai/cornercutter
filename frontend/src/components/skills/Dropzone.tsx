import { Box } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import { useDrop } from 'react-dnd';
import { Item, ItemType } from '../../types/ItemTypes';

interface Props {
    onItemDropped?: (item: Item) => void;
    children?: ReactNode;
}

interface DropProps {
    canDrop: boolean;
}

const Dropzone: FC<Props> = (props) => {
    const [{ canDrop }, dropRef] = useDrop<Item, unknown, DropProps>(() => ({
        accept: ItemType.SKILL,
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
