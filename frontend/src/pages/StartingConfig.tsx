import { Box, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import { FC } from 'react';
import SearchColumn from '../components/SearchColumn';
import SkillSelector from '../components/skills/SkillSelector';
import useConfigContext from '../context/ConfigContext';
import { Skills } from '../data/TestSkills';
import { Item } from '../types/ItemTypes';

const StartingConfig: FC = () => {
    const [config, setConfig] = useConfigContext();

    function addSkill(skill: Item) {
        setConfig((config) => ({ ...config, startingSkillIds: [skill.id, ...config.startingSkillIds] }));
    }

    function removeSkill(index: number) {}

    return (
        <Flex gap={4}>
            <Box width="full">
                <Heading size="md">Select your starting skills</Heading>
                <SimpleGrid mt={4} columns={[1, null, 2, 3, 4, 6]} gap={4}>
                    <SkillSelector skillIds={config.startingSkillIds} addSkill={addSkill} removeSkill={removeSkill} />
                </SimpleGrid>
            </Box>
            <SearchColumn items={Skills} />
        </Flex>
    );
};

export default StartingConfig;
