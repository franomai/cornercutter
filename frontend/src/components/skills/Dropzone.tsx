import { Box, Center, Text } from '@chakra-ui/react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { useDrop } from 'react-dnd';
import { ItemType, Item } from '../../types/ItemTypes';

interface Props {
    itemType: ItemType;
    onItemDropped?: (item: Item) => void;
}

interface DropProps {
    isOver: boolean;
    canDrop: boolean;
}

const Dropzone: FC<Props> = (props) => {
    const [{ isOver, canDrop }, dropRef] = useDrop<Item, unknown, DropProps>(() => ({
        accept: props.itemType.id,
        drop: (item) => {
            if (props.onItemDropped) props.onItemDropped(item);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }));

    const enabled = isOver && canDrop;

    return (
        <Box
            p={3}
            ref={dropRef}
            border="1px dashed"
            borderColor={canDrop ? 'blue.200' : undefined}
            rounded="lg"
            className="square"
        >
            <Center p={2} background={enabled ? 'whiteAlpha.100' : undefined} w="full" h="full" rounded="md">
                <Text color={canDrop ? 'blue.200' : undefined}>
                    <FontAwesomeIcon icon={faPlus} size="2x" />
                </Text>
            </Center>
        </Box>
    );
};

export default Dropzone;
