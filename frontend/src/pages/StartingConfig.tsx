import { Box, Grid, GridItem } from '@chakra-ui/react';
import { FC } from 'react';
import DropTarget from '../components/dragdrop/DropTarget';
import SearchColumn from '../components/SearchColumn';
import { Skills } from '../data/TestItems';

const StartingConfig: FC = () => {
    return (
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            <GridItem colSpan={2}>
                <div>Starting configuration!</div>
                <DropTarget onItemDropped={console.log}>Drop stuff here!</DropTarget>
            </GridItem>
            <GridItem colSpan={1}>
                <SearchColumn items={Skills} />
            </GridItem>
        </Grid>
    );
};

export default StartingConfig;
