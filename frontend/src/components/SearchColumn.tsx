import { Box, Divider, Input, Stack, Text } from '@chakra-ui/react';
import { FC, ReactNode, useEffect, useState } from 'react';
import SearchColumnItem from '../types/SearchColumnItem';
import Skill from './dragdrop/Skill';

interface Props {
    items: SearchColumnItem[];
}

const SearchColumn: FC<Props> = (props) => {
    const [search, setSearch] = useState('');
    const [filteredResults, setFilteredResults] = useState(props.items);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const loweredSearch = search.toLowerCase();
            setFilteredResults(props.items.filter((item) => item.name.toLowerCase().includes(loweredSearch)));
        }, 500); // Wait 0.5 seconds after they've finished typing to apply the filter

        return () => clearTimeout(timeout);
    }, [search]);

    function renderItems(): ReactNode {
        if (filteredResults.length === 0) {
            return <Text>No results...</Text>;
        }

        return filteredResults.map((item) => {
            return (
                <Box key={item.id} rounded="sm" _hover={{ background: 'whiteAlpha.100' }}>
                    {item.render}
                </Box>
            );
        });
    }

    return (
        <Stack direction="row" h="full">
            <Divider orientation="vertical" />
            <Box pl={2}>
                <div>
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        variant="filled"
                        placeholder="Search by name..."
                    />
                </div>
                <Stack spacing={2} mt={2}>
                    {renderItems()}
                </Stack>
            </Box>
        </Stack>
    );
};

export default SearchColumn;
