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
        setConfig((config) => ({ ...config, startingSkillIds: [...config.startingSkillIds, skill.id] }));
    }

    function removeSkill(index: number) {
        // The '1' in splice shows we only want to remove 1 element at the specified index
        config.startingSkillIds.splice(index, 1);
        setConfig((config) => ({ ...config, startingSkillIds: [...config.startingSkillIds] }));
    }

    return (
        <Flex gap={4}>
            <Box width="full" h="full">
                <Heading size="md" mb={4}>
                    Select your starting skills
                </Heading>
                <SkillSelector
                    skillIds={config.startingSkillIds}
                    addSkill={addSkill}
                    removeSkill={removeSkill}
                    columns={[1, null, 2, 3, 4, 6]}
                />
            </Box>
            <SearchColumn items={Skills} />
        </Flex>
    );
};

export default StartingConfig;
