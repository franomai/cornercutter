import { Box, Flex, FlexProps, SimpleGrid, SimpleGridProps, Stack, Text } from '@chakra-ui/react';
import { ReactNode, useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useSelector } from 'react-redux';
import { getAllSkills } from '../../redux/slices/skills';
import { ItemType } from '../../types/ItemTypes';
import BlankTextLayout from '../layout/BlankTextLayout';
import SkillCard from './SkillCard';

const Dropzone = ({
    skills,
    singleRow,
    handleDropSkill,
    handleDeleteSkill,
}: {
    skills: number[];
    singleRow?: boolean;
    handleDropSkill(skillId: number): void;
    handleDeleteSkill(skillIndex: number): void;
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const allSkills = useSelector(getAllSkills);
    const [{ canDrop }, dropRef] = useDrop<{ id: number }, unknown, { canDrop: boolean }>(() => ({
        accept: ItemType.SKILL,
        drop: ({ id }) => handleDropSkill(id),
        collect: (monitor) => ({
            canDrop: monitor.canDrop(),
        }),
    }));

    useEffect(() => {
        if (singleRow) {
            scrollRef.current?.scrollTo({
                left: scrollRef.current.scrollWidth,
                behavior: 'smooth',
            });
        }
    }, [skills, singleRow]);

    function renderInCenter(children: ReactNode): ReactNode {
        return (
            <Stack position="absolute" m={-2} w="full" h="full" alignItems="center" justifyContent="center">
                {children}
            </Stack>
        );
    }

    function getGridProps(): FlexProps {
        return singleRow ? { overflowY: 'hidden', overflowX: 'auto' } : { flexWrap: 'wrap', height: 'full' };
    }

    return (
        <Box p={2} ref={dropRef} border="2px dashed" borderColor={canDrop ? 'green.300' : 'gray.600'} rounded="lg">
            <Flex
                ref={scrollRef}
                minHeight="150px"
                position="relative"
                gap={2}
                w="full"
                maxW="full"
                direction="row"
                {...getGridProps()}
            >
                {skills.map((skillId, skillIndex) => (
                    <SkillCard
                        key={skillIndex}
                        skill={allSkills[skillId]}
                        deleteIcon
                        handleDelete={() => handleDeleteSkill(skillIndex)}
                    />
                ))}
                {skills.length === 0 &&
                    (canDrop
                        ? renderInCenter(
                              <Text fontSize="5xl" fontWeight="bold" color="green.300" userSelect="none">
                                  Drop Here
                              </Text>,
                          )
                        : renderInCenter(<BlankTextLayout title="Add Skills" subtitle="Simply drag and drop" />))}
            </Flex>
        </Box>
    );
};

export default Dropzone;
