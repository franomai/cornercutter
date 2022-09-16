import { Box, Stack, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useDrop } from 'react-dnd';
import { useSelector } from 'react-redux';
import { getAllSkills } from '../../redux/slices/skills';
import { ItemType } from '../../types/ItemTypes';
import BlankTextLayout from '../layout/BlankTextLayout';
import SkillCard from './SkillCard';

const Dropzone = ({
    skills,
    singleRow,
    handleSkillDrop,
}: {
    skills: number[];
    singleRow?: boolean;
    handleSkillDrop(skillId: number): void;
}) => {
    const allSkills = useSelector(getAllSkills);
    const [{ canDrop }, dropRef] = useDrop<{ id: number }, unknown, { canDrop: boolean }>(() => ({
        accept: ItemType.SKILL,
        drop: ({ id }) => handleSkillDrop(id),
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
            {skills.map((skillId) => (
                <SkillCard key={skillId} skill={allSkills[skillId]} deleteIcon />
            ))}
        </Box>
    );
};

export default Dropzone;
