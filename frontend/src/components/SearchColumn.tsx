import { Box, Input, Stack, Text } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import SearchColumnItem from '../types/SearchColumnItem';

interface Props {
    items: SearchColumnItem[];
}

const SearchColumn: FC<Props> = (props) => {
    function renderItems(): ReactNode {
        if (props.items.length === 0) {
            return <Text>No results...</Text>;
        }

        return props.items.map((item) => {
            return <div key={item.id}>{item.render}</div>;
        });
    }

    return (
        <Box borderLeft="1px" pl={4}>
            <div>
                <Input variant="filled" placeholder="Search by name..." />
            </div>
            <Stack spacing={2} mt={2}>
                {renderItems()}
            </Stack>
        </Box>
    );
};

export default SearchColumn;
