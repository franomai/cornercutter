import { Box, Flex, IconButton, Image, Stack, Text, Tooltip } from '@chakra-ui/react';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useState } from 'react';
import Skill from '../../types/Skill';

const SkillCard = ({
    skill,
    deleteIcon,
    infoIcon,
    handleDelete,
}: {
    skill: Skill;
    deleteIcon?: boolean;
    infoIcon?: boolean;
    handleDelete?(): void;
}) => {
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
                {infoIcon && (
                    <Tooltip label={skill.description} hasArrow placement="top">
                        <FontAwesomeIcon size="lg" icon={faCircleQuestion} />
                    </Tooltip>
                )}
            </Stack>
        );
    }

    return (
        <Flex
            position="relative"
            direction="column"
            gap="2px"
            bg="gray.800"
            rounded="sm"
            _hover={{ bg: 'whiteAlpha.100' }}
            p={2}
            alignItems="center"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {isHovering && renderIcons()}
            <Image alt={skill.name} src={`icons/${skill.image}`} height="120px" />
            <Text fontSize="sm" fontWeight="semibold">
                {skill.name}
            </Text>
        </Flex>
    );
};

export default SkillCard;
