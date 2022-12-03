import SkillCard from '../skills/SkillCard';
import useDebounce from '../../hooks/UseDebounce';
import BlankTextLayout from '../layout/BlankTextLayout';

import { useDrop } from 'react-dnd';
import { useSelector } from 'react-redux';
import { WeightedSkill } from '../../types/Skill';
import { ItemType } from '../../types/enums/ItemType';
import { getSelectedMod } from '../../redux/slices/mod';
import { getAllSkills } from '../../redux/slices/skills';
import { SpawnType } from '../../types/enums/ConfigEnums';
import { Box, Flex, FlexProps, Stack, Text } from '@chakra-ui/react';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface DropzoneProps {
    skills: WeightedSkill[];
    singleRow?: boolean;
    handleSetSkills(skills: WeightedSkill[]): void;
}

export default function Dropzone({ skills, singleRow, handleSetSkills }: DropzoneProps) {
    const allSkills = useSelector(getAllSkills);
    const scrollRef = useRef<HTMLDivElement>(null);
    const selectedMod = useSelector(getSelectedMod);

    const [prevSkillCount, setPrevSkillCount] = useState(0);

    const flexProps = useMemo<FlexProps>(
        () =>
            singleRow
                ? { overflowY: 'hidden', overflowX: 'auto' }
                : { flexWrap: 'wrap', height: 'full', overflowY: 'auto' },
        [singleRow],
    );

    const [{ canDrop }, dropRef] = useDrop<{ id: number }, unknown, { canDrop: boolean }>(
        () => ({
            accept: ItemType.SKILL,
            drop: ({ id }) => {
                handleSetSkills([...skills, { id, weight: 10 }]);
            },
            collect: (monitor) => ({ canDrop: monitor.canDrop() }),
        }),
        [skills, handleSetSkills],
    );

    useEffect(() => {
        if (singleRow && skills.length > prevSkillCount) {
            scrollRef.current?.scrollTo({
                left: scrollRef.current.scrollWidth,
                behavior: 'smooth',
            });
        }
        setPrevSkillCount(skills.length);
    }, [singleRow, skills.length, prevSkillCount]);

    const handleDeleteSkill = useCallback(
        (skillIndex: number) => {
            handleSetSkills(skills.filter((_, index) => index !== skillIndex));
        },
        [skills, handleSetSkills],
    );

    const handleUpdateSkillWeight = useCallback(
        (skillIndex: number, newWeight: number) => {
            handleSetSkills(
                skills.map((skill, index) => (index === skillIndex ? { ...skill, weight: newWeight } : skill)),
            );
        },
        [skills, handleSetSkills],
    );

    const renderInCenter = useCallback((children: ReactNode): ReactNode => {
        return (
            <Stack position="absolute" m={-2} w="full" h="full" alignItems="center" justifyContent="center">
                {children}
            </Stack>
        );
    }, []);

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
            maxW="full"
            overflow="hidden"
        >
            <Flex
                ref={scrollRef}
                minHeight="150px"
                gap={2}
                w="full"
                maxW="full"
                direction="row"
                alignContent="flex-start"
                {...flexProps}
            >
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
}
