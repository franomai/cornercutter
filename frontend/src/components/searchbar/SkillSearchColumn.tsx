import { Box, Stack, Text } from '@chakra-ui/react';
import { ReactNode, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllSkills } from '../../redux/slices/skills';
import DraggableSkillCard from '../skills/DraggableSkillCard';
import SearchBar from './SearchBar';

const SearchColumn = () => {
    const skills = useSelector(getAllSkills);

    const allSkills = useCallback(() => {
        return Object.values(skills).sort((a, b) => a.name.localeCompare(b.name));
    }, [skills]);

    const [visibleSkills, setVisibleSkills] = useState(allSkills());

    const filterSkills = useCallback(
        (search: string) => {
            const loweredSearch = search.toLowerCase();
            if (search === '') {
                setVisibleSkills(allSkills());
            } else {
                setVisibleSkills(allSkills().filter((skill) => skill.name.toLowerCase().includes(loweredSearch)));
            }
        },
        [skills],
    );

    function renderItems(): ReactNode {
        if (visibleSkills.length === 0) {
            return <Text align="center">No results...</Text>;
        }

        return visibleSkills.map((skill) => <DraggableSkillCard key={skill.id} skill={skill} infoIcon />);
    }

    return (
        <Stack minW="240px" maxW="240px" minH="full" background="blackAlpha.200" pt={2} px={4} gap={1} pb={2}>
            <SearchBar handleSearch={filterSkills} />
            <Stack gap={1} overflowY="auto" pr={2} h="full" style={{ scrollbarGutter: 'stable' }}>
                {renderItems()}
            </Stack>
        </Stack>
    );
};

export default SearchColumn;
