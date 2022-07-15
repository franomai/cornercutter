import { Box, CloseButton, Divider, Input, InputGroup, InputRightElement, Stack, Text } from '@chakra-ui/react';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import SearchColumnItem from '../types/SearchColumnItem';

interface Props {
    items: SearchColumnItem[];
}

const SearchColumn: FC<Props> = (props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [search, setSearch] = useState('');
    const [filteredResults, setFilteredResults] = useState(props.items);

    useEffect(() => {
        const timeout = setTimeout(filterResults, 500); // Wait 0.5 seconds after they've finished typing to apply the filter

        return () => clearTimeout(timeout);
    }, [search]);

    function filterResults() {
        const loweredSearch = search.toLowerCase();
        if (search === '') {
            setFilteredResults(props.items);
            return;
        }
        setFilteredResults(props.items.filter((item) => item.name.toLowerCase().includes(loweredSearch)));
    }

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

    function handleClearSearch() {
        setSearch('');
        setFilteredResults(props.items);
        if (inputRef.current) inputRef.current.focus();
    }

    return (
        <Stack direction="row" h="full">
            <Divider orientation="vertical" />
            <Box pl={2}>
                <InputGroup>
                    <Input
                        ref={inputRef}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        variant="filled"
                        placeholder="Search by name..."
                    />
                    {search !== '' && (
                        <InputRightElement>
                            <CloseButton title="Clear search" onClick={handleClearSearch} />
                        </InputRightElement>
                    )}
                </InputGroup>
                <Stack spacing={2} mt={2}>
                    {renderItems()}
                </Stack>
            </Box>
        </Stack>
    );
};

export default SearchColumn;
