import { Box, Center } from '@chakra-ui/react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { Item } from '../../types/ItemTypes';
import Skill from './ItemRender';

interface Props {
    item: Item;
    onRemoveSkill: VoidFunction;
}

const SelectedSkill: FC<Props> = (props) => {
    return (
        <Box border="1px" p={3} rounded="lg" className="square">
            <Center p={2} w="full" h="full" position="relative">
                <Box position="absolute" right={0} top={-1} _hover={{ textColor: 'blue.200' }} rounded="full">
                    <FontAwesomeIcon icon={faTrash} title="Remove skill" onClick={props.onRemoveSkill} />
                </Box>
                <Skill item={props.item} />
            </Center>
        </Box>
    );
};

export default SelectedSkill;
