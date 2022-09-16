import { Flex, Image, Text } from '@chakra-ui/react';
import Skill from '../../types/Skill';

const SkillCard = ({ skill }: { skill: Skill }) => {
    return (
        <Flex
            direction="column"
            gap="2px"
            bg="gray.800"
            rounded="sm"
            _hover={{ bg: 'whiteAlpha.100' }}
            p={2}
            alignItems="center"
        >
            <Image alt={skill.name} src={`icons/${skill.image}`} />
            <Text fontSize="sm" fontWeight="semibold">
                {skill.name}
            </Text>
        </Flex>
    );
};

export default SkillCard;
