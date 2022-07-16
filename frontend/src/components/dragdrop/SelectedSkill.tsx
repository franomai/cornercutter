import { Box, Center } from '@chakra-ui/react';
import { FC } from 'react';
import { Item } from '../../types/ItemTypes';
import ItemRender from './ItemRender';

interface Props {
    item: Item;
}

const SelectedSkill: FC<Props> = (props) => {
    return (
        <Box border="1px" p={3} rounded="lg" className="square">
            <Center p={2} w="full" h="full">
                <ItemRender item={props.item} />
            </Center>
        </Box>
    );
};

export default SelectedSkill;
