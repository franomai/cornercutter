import { CloseButton, Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';

const SearchBar = ({
    handleSearch,
    placeholder = 'Search...',
}: {
    handleSearch(search: string): void;
    placeholder?: string;
}) => {
    const [search, setSearch] = useState('');
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Wait 0.3 seconds after they've finished typing to apply the search
        const timeout = setTimeout(() => handleSearch(search), 300);

        return () => clearTimeout(timeout);
    }, [search]);

    const handleUpdateSearch = (search: string) => {
        setSearch(search);
        handleSearch(search);
    };

    const handleClearSearch = () => {
        handleUpdateSearch('');
        if (ref.current) {
            ref.current.focus();
        }
    };

    return (
        <InputGroup color={search.length === 0 ? 'gray.600' : 'white'} w="full" size="sm">
            <InputLeftElement>
                <FontAwesomeIcon icon={faSearch} />
            </InputLeftElement>
            <Input
                _placeholder={{ color: 'gray.600' }}
                ref={ref}
                value={search}
                variant="filled"
                onChange={(e) => handleUpdateSearch(e.target.value)}
                placeholder={placeholder}
            />
            {search.length !== 0 && (
                <InputRightElement>
                    <CloseButton title="Clear search" onClick={handleClearSearch} />
                </InputRightElement>
            )}
        </InputGroup>
    );
};

export default SearchBar;
