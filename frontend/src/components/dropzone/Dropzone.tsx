import { Box, Flex, FlexProps, SimpleGrid, SimpleGridProps, Stack, Text } from '@chakra-ui/react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useSelector } from 'react-redux';
import { getSelectedMod } from '../../redux/slices/mod';
import { getAllSkills } from '../../redux/slices/skills';
import { SpawnType } from '../../types/Configuration';
import { ItemType } from '../../types/ItemTypes';
import { WeightedSkill } from '../../types/Skill';
import BlankTextLayout from '../layout/BlankTextLayout';
import SkillCard from '../skills/SkillCard';

export interface DropzoneProps {
    skills: WeightedSkill[];
    singleRow?: boolean;
    handleDeleteSkill(skillIndex: number): void;
    handleDropSkill(weightedSkill: WeightedSkill): void;
    handleUpdateSkillWeight(skillIndex: number, newWeight: number): void;
}

const Dropzone = ({
    skills,
    singleRow,
    handleDropSkill,
    handleDeleteSkill,
    handleUpdateSkillWeight,
}: DropzoneProps) => {
    const selectedMod = useSelector(getSelectedMod);

    const scrollRef = useRef<HTMLDivElement>(null);
    const allSkills = useSelector(getAllSkills);
    const [{ canDrop }, dropRef] = useDrop<{ id: number }, unknown, { canDrop: boolean }>(() => ({
        accept: ItemType.SKILL,
        drop: ({ id }) => handleDropSkill({ id, weight: 10 }),
        collect: (monitor) => ({
            canDrop: monitor.canDrop(),
        }),
    }));

    const [prevSkillCount, setPrevSkillCount] = useState(0);

    useEffect(() => {
        if (singleRow && skills.length > prevSkillCount) {
            scrollRef.current?.scrollTo({
                left: scrollRef.current.scrollWidth,
                behavior: 'smooth',
            });
        }
        setPrevSkillCount(skills.length);
    }, [skills.length, singleRow, prevSkillCount]);

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
        <Box
            flexGrow={singleRow ? undefined : 1}
            position="relative"
            p={2}
            ref={dropRef}
            border="2px dashed"
            borderColor={canDrop ? 'green.300' : 'gray.600'}
            rounded="lg"
            w="full"
        >
            <Flex ref={scrollRef} minHeight="150px" gap={2} w="full" maxW="full" direction="row" {...getGridProps()}>
                {skills.map((weightedSkill, skillIndex) => (
                    <SkillCard
                        key={skillIndex}
                        isWeighted={selectedMod?.general.spawns === SpawnType.Weighted}
                        skill={allSkills[weightedSkill.id]}
                        weighting={weightedSkill.weight}
                        deleteIcon
                        handleDelete={() => handleDeleteSkill(skillIndex)}
                        handleUpdateWeight={(newWeight) => handleUpdateSkillWeight(skillIndex, newWeight)}
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
