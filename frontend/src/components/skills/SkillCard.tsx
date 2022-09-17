import { Flex, FlexProps, forwardRef, IconButton, Image, Stack, Text } from '@chakra-ui/react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useState } from 'react';
import Skill from '../../types/Skill';
import HelpIcon from '../HelpIcon';

export interface SkillCardProps {
    skill: Skill;
    infoIcon?: boolean;
    deleteIcon?: boolean;
    flexProps?: FlexProps;
    handleDelete?(): void;
}

const SkillCard = forwardRef<SkillCardProps, 'div'>(
    ({ skill, infoIcon, deleteIcon, handleDelete, ...flexProps }, ref) => {
        const [isHovering, setIsHovering] = useState(false);

        function renderIcons(): ReactNode {
            return (
                <Stack direction="row" position="absolute" right={3} top={3} spacing={1}>
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

        return (
            <Flex
                ref={ref}
                position="relative"
                direction="column"
                gap="2px"
                bg="gray.800"
                rounded="md"
                _hover={{ bg: 'whiteAlpha.100' }}
                p={2}
                alignItems="center"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                maxH="150px"
                minH="150px"
                maxW="180px"
                minW="180px"
                {...flexProps}
            >
                {isHovering && renderIcons()}
                <Image alt={skill.name} src={`icons/${skill.image}`} height="115px" />
                <Text fontSize="sm" fontWeight="semibold">
                    {skill.name}
                </Text>
            </Flex>
        );
    },
);

export default SkillCard;
