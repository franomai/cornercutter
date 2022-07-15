import { Box } from '@chakra-ui/react';
import { FC, ReactNode, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';

interface Props {
    children?: ReactNode;
    onItemDropped: (dragItem: string) => void;
}

const DropTarget: FC<Props> = (props) => {
    const [{ isOver, item }, dropRef] = useDrop(() => ({
        accept: ItemTypes.SKILL,
        drop: () => console.log('dropped'),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            item: monitor.getItem(),
        }),
    }));

    useEffect(() => {
        console.log('is over!', isOver, '-', item);
    }, [isOver]);

    return (
        <div ref={dropRef} style={{ border: '1px dashed', padding: '10px' }}>
            {props.children}
        </div>
    );
};

export default DropTarget;
