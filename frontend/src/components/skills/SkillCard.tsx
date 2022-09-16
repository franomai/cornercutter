import { Box, Flex, Image, Stack, Text, Tooltip } from '@chakra-ui/react';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useState } from 'react';
import Skill from '../../types/Skill';

const SkillCard = ({ skill, deleteIcon, infoIcon }: { skill: Skill; deleteIcon?: boolean; infoIcon?: boolean }) => {
    const [isHovering, setIsHovering] = useState(false);

    function renderIcons(): ReactNode {
        return (
            <Stack position="absolute" right={2} top={2} spacing={2}>
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
            <Image alt={skill.name} src={`icons/${skill.image}`} />
            <Text fontSize="sm" fontWeight="semibold">
                {skill.name}
            </Text>
        </Flex>
    );
};

export default SkillCard;
