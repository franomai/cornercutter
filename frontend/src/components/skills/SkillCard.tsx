import {
    Box,
    Flex,
    FlexProps,
    forwardRef,
    IconButton,
    Image,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Stack,
    Text,
} from '@chakra-ui/react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useEffect, useState } from 'react';

import Skill from '../../types/Skill';
import HelpIcon from '../forms/HelpIcon';

export interface SkillCardProps {
    skill: Skill;
    isWeighted?: boolean;
    weighting?: number;
    infoIcon?: boolean;
    deleteIcon?: boolean;
    flexProps?: FlexProps;
    handleDelete?(): void;
    handleUpdateWeight?(newWeighting: number): void;
}

const SkillCard = forwardRef<SkillCardProps, 'div'>(
    ({ skill, isWeighted, weighting, infoIcon, deleteIcon, handleDelete, handleUpdateWeight, ...flexProps }, ref) => {
        const [isHovering, setIsHovering] = useState(false);
        const [newWeight, setNewWeight] = useState(weighting ?? 10);

        useEffect(() => {
            if (weighting !== newWeight) {
                // Don't call the update function until they stop editing it for a while
                const timeout = setTimeout(() => {
                    if (handleUpdateWeight) {
                        handleUpdateWeight(newWeight);
                    }
                }, 500);

                return () => clearTimeout(timeout);
            }
        }, [weighting, newWeight]);

        function renderIcons(): ReactNode {
            return (
                <Stack direction="row" position="absolute" right={2} top={2.5} spacing={1}>
                    {deleteIcon && (
                        <IconButton
                            variant="ghost"
                            mt={-1.5}
                            size="sm"
                            onClick={handleDelete}
                            aria-label="Delete skill"
                            title="Delete skill"
                            icon={<FontAwesomeIcon icon={faTrash} />}
                        />
                    )}
                    {infoIcon && <HelpIcon tooltip={skill.description} size="lg" />}
                </Stack>
            );
        }

        function renderWeighting(): ReactNode {
            return (
                <Box position="absolute" left={2} top={2.5}>
                    {isHovering ? (
                        <NumberInput
                            onChange={(_, newWeight) => setNewWeight(newWeight)}
                            size="xs"
                            defaultValue={10}
                            value={newWeight}
                            min={1}
                            max={999}
                            precision={0}
                            allowMouseWheel
                            w="55px"
                        >
                            <NumberInputField pr={2} fontWeight="semibold" />
                            <NumberInputStepper w="15px">
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    ) : (
                        <Text ml="9px" mt="3px" fontSize="xs" fontWeight="semibold">
                            {newWeight}
                        </Text>
                    )}
                </Box>
            );
        }

        return (
            <Flex
                userSelect="none"
                ref={ref}
                position="relative"
                direction="column"
                gap="2px"
                bg="bg.main"
                rounded="md"
                _hover={{ bg: 'bg.light' }}
                p={2}
                alignItems="center"
                justifyContent="center"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                maxH="150px"
                minH="150px"
                maxW="180px"
                minW="180px"
                {...flexProps}
            >
                <Image alt={skill.name} src={`icons/${skill.image}`} overflow="hidden" />
                <Text fontSize="sm" fontWeight="semibold">
                    {skill.name}
                </Text>
                {isHovering && renderIcons()}
                {isWeighted && renderWeighting()}
            </Flex>
        );
    },
);

export default SkillCard;
