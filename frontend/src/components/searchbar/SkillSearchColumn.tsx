import { Box, CloseButton, Input, InputGroup, InputRightElement, Stack, Text } from '@chakra-ui/react';
import { ReactNode, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllSkills } from '../../redux/slices/skills';
import DraggableSkill from '../skills/Skill';
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

        return visibleSkills.map((skill) => {
            return (
                <Box key={skill.id} rounded="sm" _hover={{ background: 'whiteAlpha.100' }}>
                    <DraggableSkill item={skill} />
                </Box>
            );
        });
    }

    return (
        <Stack w="280px" h="full" background="blackAlpha.200" pt={2} px={4} gap={1} overflow="none" pb={14}>
            <SearchBar handleSearch={filterSkills} />
            <Stack gap={1} overflowY="scroll" pr={2}>
                {renderItems()}
            </Stack>
        </Stack>
    );
};

export default SearchColumn;
