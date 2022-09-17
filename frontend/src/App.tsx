import { Box, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { getAllMods, getSelectedMod } from './redux/slices/mod';
import { Floor, Options } from './types/Configuration';
import { ReactNode, useCallback } from 'react';
import { modHasOption } from './utility/ConfigHelpers';
import { useSelector } from 'react-redux';

import BlankTextLayout from './components/layout/BlankTextLayout';
import FloorConfigTab from './components/tabs/FloorConfigTab';
import GeneralConfigTab from './components/tabs/generalconfig';
import TabData from './types/TabData';
import ModList from './components/mods/ModList';
import './App.css';

function App() {
    const mods = useSelector(getAllMods);
    const selectedMod = useSelector(getSelectedMod);

    const getTabs = useCallback((): TabData[] => {
        // Sanity check, this should never be true
        if (!selectedMod) return [];

        const tabs: TabData[] = [
            {
                name: 'General Config',
                tab: <GeneralConfigTab selectedMod={selectedMod} />,
            },
        ];

        if (modHasOption(selectedMod, Options.ConfigPerFloor)) {
            tabs.push(
                {
                    name: 'Floor 1',
                    tab: <FloorConfigTab selectedMod={selectedMod} floor={Floor.FirstFloor} />,
                },
                {
                    name: 'Floor 2',
                    tab: <FloorConfigTab selectedMod={selectedMod} floor={Floor.SecondFloor} />,
                },
                {
                    name: 'Floor 3',
                    tab: <FloorConfigTab selectedMod={selectedMod} floor={Floor.ThirdFloor} />,
                },
                {
                    name: 'Boss Floor',
                    tab: <FloorConfigTab selectedMod={selectedMod} floor={Floor.Boss} />,
                },
            );
        } else {
            tabs.push({
                name: 'All Floors',
                tab: <FloorConfigTab selectedMod={selectedMod} floor={Floor.AllFloors} />,
            });
        }

        return tabs;
    }, [selectedMod]);

    function renderTabs(): ReactNode {
        const tabs = getTabs();

        return (
            <Tabs h="full" maxW="full" display="flex" style={{ flexDirection: 'column' }} overflow="hidden">
                <TabList background="blackAlpha.200" w="full">
                    {tabs.map((tab) => (
                        <Tab key={tab.name} fontWeight="semibold" pt={5} pb={3}>
                            {tab.name}
                        </Tab>
                    ))}
                </TabList>
                {/* Height subtracted is the height of the TabList */}
                <TabPanels minH="calc(100% - 58px)" maxH="calc(100% - 58px)">
                    {tabs.map((tab) => (
                        <TabPanel key={tab.name} h="full" p={0}>
                            {tab.tab}
                        </TabPanel>
                    ))}
                </TabPanels>
            </Tabs>
        );
    }

    return (
        <Box display="flex" flexDirection="row" h="full" maxW="full" w="full" overflowX="hidden">
            <ModList />
            <Stack direction="column" h="full" w="full" maxW="full" overflowX="hidden">
                {selectedMod ? (
                    renderTabs()
                ) : (
                    <BlankTextLayout
                        title="No Mod Selected"
                        subtitle={
                            mods.length === 0
                                ? 'Create a mod in the left pane to get started'
                                : 'Select a mod in the left pane to get started'
                        }
                    />
                )}
            </Stack>
        </Box>
    );
}

export default App;
