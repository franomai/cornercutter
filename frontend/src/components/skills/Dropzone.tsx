import { Box } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import { useDrop } from 'react-dnd';
import { Item, ItemType } from '../../types/ItemTypes';
import Skill from '../../types/Skill';

const Dropzone = ({
    skills,
    singleRow,
    handleSkillDrop,
}: {
    skills: Skill[];
    singleRow?: boolean;
    handleSkillDrop(skill: Skill): void;
}) => {
    const [{ canDrop }, dropRef] = useDrop<Skill, unknown, { canDrop: boolean }>(() => ({
        accept: ItemType.SKILL,
        drop: handleSkillDrop,
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
            maxH="full"
            overflowY="auto"
        >
            {}
        </Box>
    );
};

export default Dropzone;
