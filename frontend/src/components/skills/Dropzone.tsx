import { Box, Stack, Text } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import { useDrop } from 'react-dnd';
import { Item, ItemType } from '../../types/ItemTypes';
import Skill from '../../types/Skill';
import BlankTextLayout from '../layout/BlankTextLayout';

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
        drop: (skill) => handleSkillDrop(skill),
        collect: (monitor) => ({
            canDrop: monitor.canDrop(),
        }),
    }));

    function renderInCenter(children: ReactNode): ReactNode {
        return (
            <Stack position="absolute" m={-2} w="full" h="full" alignItems="center" justifyContent="center">
                {children}
            </Stack>
        );
    }

    return (
        <Box
            position="relative"
            p={2}
            ref={dropRef}
            border="2px dashed"
            borderColor={canDrop ? 'green.300' : 'gray.600'}
            rounded="lg"
            w="full"
            h="full"
            maxH="full"
            overflowY="auto"
        >
            {canDrop &&
                renderInCenter(
                    <Text fontSize="5xl" fontWeight="bold" color="green.300">
                        Drop Here
                    </Text>,
                )}
            {!canDrop &&
                skills.length === 0 &&
                renderInCenter(<BlankTextLayout title="Add Skills" subtitle="Simply drag and drop" />)}
        </Box>
    );
};

export default Dropzone;
