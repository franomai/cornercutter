import { CloseButton, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';

const SearchBar = ({
    handleSearch,
    placeholder = 'Search...',
}: {
    handleSearch(search: string): void;
    placeholder: string;
}) => {
    const [search, setSearch] = useState('');
    const ref = useRef<HTMLInputElement>(null);

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
        <InputGroup color={search.length === 0 ? 'gray.600' : 'white'} background="gray.800">
            <InputRightElement>
                <FontAwesomeIcon icon={faSearch} />
            </InputRightElement>
            <Input
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
