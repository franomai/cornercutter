import { Grid, GridItem, Stack, Text } from '@chakra-ui/react';
import { FC } from 'react';
import Dropzone from '../components/dragdrop/Dropzone';
import { ItemTypes } from '../components/ItemTypeDefinitions';
import SearchColumn from '../components/SearchColumn';
import { Skills } from '../data/TestSkills';

const StartingConfig: FC = () => {
    return (
        <Grid templateColumns="repeat(4, 1fr)" gap={4}>
            <GridItem colSpan={3}>
                <Text>Select your starting skills</Text>
                <Stack direction="row" gap={2} mt={2}>
                    <Dropzone itemType={ItemTypes.SKILL} />
                    <Dropzone itemType={ItemTypes.SKILL} />
                    <Dropzone itemType={ItemTypes.SKILL} />
                </Stack>
            </GridItem>
            <GridItem colSpan={1}>
                <SearchColumn items={Skills} />
            </GridItem>
        </Grid>
    );
};

export default StartingConfig;
