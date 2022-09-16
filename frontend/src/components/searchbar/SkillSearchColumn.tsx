import { Box, Stack, Text } from '@chakra-ui/react';
import { ReactNode, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllSkills } from '../../redux/slices/skills';
import SkillCard from '../skills/SkillCard';
import SearchBar from './SearchBar';

const SearchColumn = () => {
    const skills = useSelector(getAllSkills);
    const [visibleSkills, setVisibleSkills] = useState(Object.values(skills));

    const filterSkills = useCallback(
        (search: string) => {
            const loweredSearch = search.toLowerCase();
            if (search === '') {
                setVisibleSkills(Object.values(skills));
            } else {
                setVisibleSkills(
                    Object.values(skills).filter((skill) => skill.name.toLowerCase().includes(loweredSearch)),
                );
            }
        },
        [skills],
    );

    function renderItems(): ReactNode {
        if (visibleSkills.length === 0) {
            return <Text align="center">No results...</Text>;
        }

        return visibleSkills.map((skill) => <SkillCard skill={skill} />);
    }

    return (
        <Stack w="300px" minH="full" background="blackAlpha.200" pt={2} px={4} gap={1} overflow="none" pb={14}>
            <SearchBar handleSearch={filterSkills} />
            <Stack gap={1} overflowY="auto" pr={2} h="full">
                {renderItems()}
            </Stack>
        </Stack>
    );
};

export default SearchColumn;
