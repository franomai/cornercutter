import { Grid, GridItem, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import Dropzone from '../components/dragdrop/Dropzone';
import SelectedSkill from '../components/dragdrop/SelectedSkill';
import { ItemTypes } from '../components/ItemTypeDefinitions';
import SearchColumn from '../components/SearchColumn';
import useConfigContext from '../context/ConfigContext';
import { skillFromId, Skills } from '../data/TestSkills';
import { Item } from '../types/ItemTypes';

const StartingConfig: FC = () => {
    const [config, setConfig] = useConfigContext();

    function renderSkills(): ReactNode {
        return config.startingSkillIds.map((id, index) => <SelectedSkill key={index} item={skillFromId(id)} />);
    }

    function addSkill(skill: Item) {
        setConfig((config) => ({ ...config, startingSkillIds: [...config.startingSkillIds, skill.id] }));
    }

    return (
        <Grid templateColumns="repeat(4, 1fr)" gap={4}>
            <GridItem colSpan={3}>
                <Text>Select your starting skills</Text>
                <SimpleGrid columns={[1, null, 2, 3, 4, 5]} gap={4}>
                    {renderSkills()}
                    <Dropzone itemType={ItemTypes.SKILL} onItemDropped={addSkill} />
                </SimpleGrid>
            </GridItem>
            <GridItem colSpan={1}>
                <SearchColumn items={Skills} />
            </GridItem>
        </Grid>
    );
};

export default StartingConfig;
