import { Grid, GridItem } from '@chakra-ui/react';
import { FC } from 'react';
import Dropzone from '../components/dragdrop/Dropzone';
import { ItemTypes } from '../components/ItemTypeDefinitions';
import SearchColumn from '../components/SearchColumn';
import { Skills } from '../data/TestSkills';

const StartingConfig: FC = () => {
    return (
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            <GridItem colSpan={2}>
                <div>Starting configuration!</div>
                <Dropzone itemType={ItemTypes.SKILL} onItemDropped={console.log} />
            </GridItem>
            <GridItem colSpan={1}>
                <SearchColumn items={Skills} />
            </GridItem>
        </Grid>
    );
};

export default StartingConfig;
