import SearchBar from './SearchBar';
import DraggableSkillCard from '../DraggableSkillCard';

import { useSelector } from 'react-redux';
import { Flex, Stack, Text } from '@chakra-ui/react';
import { getAllSkills } from '../../../redux/slices/skills';
import { ReactNode, useCallback, useMemo, useState } from 'react';

export default function SkillSearchColumn() {
    const skills = useSelector(getAllSkills);

    const allSkills = useMemo(() => {
        return Object.values(skills).sort((a, b) => a.name.localeCompare(b.name));
    }, [skills]);

    const [visibleSkills, setVisibleSkills] = useState(allSkills);

    const filterSkills = useCallback(
        (search: string) => {
            const loweredSearch = search.toLowerCase();
            if (search === '') {
                setVisibleSkills(allSkills);
            } else {
                setVisibleSkills(
                    allSkills.filter((skill) => {
                        return (
                            skill.name.toLowerCase().includes(loweredSearch) ||
                            skill.description.toLowerCase().includes(loweredSearch)
                        );
                    }),
                );
            }
        },
        [allSkills],
    );

    const renderItems = useCallback((): ReactNode => {
        if (visibleSkills.length === 0) {
            return <Text align="center">No results...</Text>;
        }

        return visibleSkills.map((skill) => <DraggableSkillCard key={skill.id} skill={skill} infoIcon />);
    }, [visibleSkills]);

    return (
        <Flex
            minW="240px"
            maxW="240px"
            minH="calc(100% - 58%)" // 58px here is the height of the tabs
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
}
