import { useEffect, useRef, useState } from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CloseButton, Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react';

interface SearchBarProps {
    handleSearch(search: string): void;
    placeholder?: string;
}

export default function SearchBar({ handleSearch, placeholder = 'Search...' }: SearchBarProps) {
    const [search, setSearch] = useState('');
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Wait 0.3 seconds after they've finished typing to apply the search
        const timeout = setTimeout(() => handleSearch(search), 300);
        return () => clearTimeout(timeout);
    }, [search, handleSearch]);

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
        <InputGroup color={search.length === 0 ? 'gray.600' : 'white'} background="gray.800" w="full" size="sm">
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
}
