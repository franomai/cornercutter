import { Flex, Stack, Text } from '@chakra-ui/react';
import { ReactNode, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllSkills } from '../../../redux/slices/skills';
import DraggableSkillCard from '../DraggableSkillCard';
import SearchBar from './SearchBar';

const SkillSearchColumn = () => {
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
        <Flex
            minW="240px"
            maxW="240px"
            minH="full"
            background="blackAlpha.200"
            pt={2}
            px={4}
            gap={1}
            pb={2}
            flexDirection="column"
            style={{ marginTop: 0 }}
        >
            <SearchBar handleSearch={filterSkills} />
            <Stack gap={1} overflowY="auto" pr={2} h="full" style={{ scrollbarGutter: 'stable' }}>
                {renderItems()}
            </Stack>
        </Flex>
    );
};

export default SkillSearchColumn;
