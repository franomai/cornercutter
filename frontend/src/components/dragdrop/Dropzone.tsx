import { Box, Center } from '@chakra-ui/react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, ReactNode, useState } from 'react';
import { useDrop } from 'react-dnd';
import { ItemType, Item } from '../../types/ItemTypes';

interface Props {
    itemType: ItemType;
    onItemDropped: (dragItem: string) => void;
}

interface DropProps {
    isOver: boolean;
    canDrop: boolean;
}

const Dropzone: FC<Props> = (props) => {
    const [item, setItem] = useState<Item | null>(null);

    const [{ isOver, canDrop }, dropRef] = useDrop<Item, unknown, DropProps>(() => ({
        accept: props.itemType.id,
        drop: (item) => setItem(item),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }));

    function renderDropzone(): ReactNode {
        if (isOver) return <FontAwesomeIcon icon={faPlus} size="2x" />;
        return item ? props.itemType.render(item) : 'Drop stuff here!';
    }

    return (
        <Box w={40} h={40} ref={dropRef} border="1px dashed" p={3} m={2} borderColor={canDrop ? 'teal.200' : undefined}>
            <Center p={2} background={isOver ? 'whiteAlpha.100' : undefined} w="full" h="full">
                {renderDropzone()}
            </Center>
        </Box>
    );
};

export default Dropzone;
