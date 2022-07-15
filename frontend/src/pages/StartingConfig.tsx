import { Grid, GridItem } from '@chakra-ui/react';
import { FC } from 'react';
import DropZone from '../components/dragdrop/DropTarget';
import SearchColumn from '../components/SearchColumn';
import { Skills } from '../data/TestItems';
import { ItemType } from '../types/ItemTypes';

const StartingConfig: FC = () => {
    return (
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            <GridItem colSpan={2}>
                <div>Starting configuration!</div>
                <DropZone itemType={ItemType.SKILL} onItemDropped={console.log} />
            </GridItem>
            <GridItem colSpan={1}>
                <SearchColumn items={Skills} />
            </GridItem>
        </Grid>
    );
};

export default StartingConfig;
