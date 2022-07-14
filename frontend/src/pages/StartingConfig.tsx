import { Grid, GridItem } from '@chakra-ui/react';
import { FC } from 'react';
import SearchColumn from '../components/SearchColumn';

const StartingConfig: FC = () => {
    return (
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            <GridItem colSpan={2}>
                <div>Starting configuration!</div>
            </GridItem>
            <GridItem colSpan={1}>
                <SearchColumn items={[]} />
            </GridItem>
        </Grid>
    );
};

export default StartingConfig;
