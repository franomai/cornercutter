import useDebounce from '../../hooks/UseDebounce';
import BlankTextLayout from '../layout/BlankTextLayout';
import SkillCard from '../skills/SkillCard';

import { useDrop } from 'react-dnd';
import { useSelector } from 'react-redux';
import { WeightedSkill } from '../../types/Skill';
import { SpawnType } from '../../types/Configuration';
import { ItemType } from '../../types/enums/SkillEnums';
import { getSelectedMod } from '../../redux/slices/mod';
import { getAllSkills } from '../../redux/slices/skills';
import { Box, Flex, FlexProps, Stack, Text } from '@chakra-ui/react';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

export interface DropzoneProps {
    skills: WeightedSkill[];
    singleRow?: boolean;
    handleSetSkills(skills: WeightedSkill[]): void;
}

const Dropzone = ({ skills, singleRow, handleSetSkills }: DropzoneProps) => {
    const selectedMod = useSelector(getSelectedMod);
    const allSkills = useSelector(getAllSkills);
    const scrollRef = useRef<HTMLDivElement>(null);

    const [prevSkillCount, setPrevSkillCount] = useState(0);
    const [updatedSkills, setUpdatedSkills] = useState(skills);
    const debouncedSkills = useDebounce(updatedSkills, 600);

    const [{ canDrop }, dropRef] = useDrop<{ id: number }, unknown, { canDrop: boolean }>(() => ({
        accept: ItemType.SKILL,
        drop: ({ id }) => {
            setUpdatedSkills((updatedSkills) => [...updatedSkills, { id, weight: 10 }]);
        },
        collect: (monitor) => ({
            canDrop: monitor.canDrop(),
        }),
    }));

    useEffect(() => {
        setUpdatedSkills(skills);
    }, [skills]);

    useEffect(() => {
        if (singleRow && updatedSkills.length > prevSkillCount) {
            scrollRef.current?.scrollTo({
                left: scrollRef.current.scrollWidth,
                behavior: 'smooth',
            });
        }
        setPrevSkillCount(updatedSkills.length);
    }, [updatedSkills.length, singleRow, prevSkillCount]);

    useEffect(() => {
        if (debouncedSkills !== skills) {
            handleSetSkills(debouncedSkills);
        }
    }, [debouncedSkills]);

    const handleDeleteSkill = useCallback(
        (skillIndex: number) => {
            setUpdatedSkills(updatedSkills.filter((_, index) => index !== skillIndex));
        },
        [setUpdatedSkills, updatedSkills],
    );

    const handleUpdateSkillWeight = useCallback(
        (skillIndex: number, newWeight: number) => {
            setUpdatedSkills(
                updatedSkills.map((skill, index) => (index === skillIndex ? { ...skill, weight: newWeight } : skill)),
            );
        },
        [setUpdatedSkills, updatedSkills],
    );

    function renderInCenter(children: ReactNode): ReactNode {
        return (
            <Stack position="absolute" m={-2} w="full" h="full" alignItems="center" justifyContent="center">
                {children}
            </Stack>
        );
    }

    function getFlexProps(): FlexProps {
        return singleRow
            ? { overflowY: 'hidden', overflowX: 'auto' }
            : { flexWrap: 'wrap', height: 'full', overflowY: 'auto' };
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
                {...getFlexProps()}
            >
                {updatedSkills.map((weightedSkill, skillIndex) => (
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
