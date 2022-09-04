import { Box, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { addMod, getAllMods, getSelectedMod } from './redux/slices/mod';
import { DEFAULT_CONFIG, Floor, Options } from './types/Configuration';
import { ReactNode, useCallback, useEffect } from 'react';
import { optionsHasFlag } from './utility/ConfigHelpers';
import { useDispatch, useSelector } from 'react-redux';

import AllFloorsConfigTab from './components/tabs/AllFloorsConfigTab';
import FloorConfigTab from './components/tabs/FloorConfigTab';
import GeneralConfigTab from './components/tabs/generalconfig';
import StartingConfigTab from './components/tabs/StartingConfigTab';
import TabData from './types/TabData';
import ModList from './components/mods/ModList';
import './App.css';

function App() {
    const dispatch = useDispatch();
    const mods = useSelector(getAllMods);
    const selectedMod = useSelector(getSelectedMod);

    useEffect(() => {
        if (mods.length === 0) {
            dispatch(
                addMod({
                    info: {
                        name: 'Placeholder mod',
                        description: 'This is a mod description...',
                    },
                    general: DEFAULT_CONFIG,
                }),
            );
        }
    }, [dispatch, mods]);

    const getTabs = useCallback((): TabData[] => {
        const tabs: TabData[] = [
            {
                name: 'General Config',
                tab: <GeneralConfigTab />,
            },
            {
                name: 'StartingConfig',
                tab: <StartingConfigTab />,
            },
        ];

        // This function will only ever be called if there is a selected mod
        if (optionsHasFlag(selectedMod!.general, Options.ConfigPerFloor)) {
            tabs.push(
                { name: 'Floor 1', tab: <FloorConfigTab floor={Floor.FirstFloor} /> },
                { name: 'Floor 2', tab: <FloorConfigTab floor={Floor.SecondFloor} /> },
                { name: 'Floor 3', tab: <FloorConfigTab floor={Floor.ThirdFloor} /> },
                { name: 'Boss Floor', tab: <FloorConfigTab floor={Floor.Boss} /> },
            );
        } else {
            tabs.push({ name: 'Floor Config', tab: <AllFloorsConfigTab /> });
        }

        return tabs;
    }, [selectedMod]);

    function renderTabs(): ReactNode {
        const tabs = getTabs();

        return (
            <Tabs h="full" display="flex" style={{ flexDirection: 'column' }} overflowY="hidden">
                <TabList background="blackAlpha.200" w="full">
                    {tabs.map((tab) => (
                        <Tab key={tab.name} fontWeight="semibold">
                            {tab.name}
                        </Tab>
                    ))}
                </TabList>
                <TabPanels h="full">
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
        <Box display="flex" flexDirection="row" h="full" w="full">
            <ModList />
            <Stack direction="column" h="full" w="full">
                {selectedMod ? (
                    renderTabs()
                ) : (
                    <Text fontSize="4xl" color="gray.800">
                        No Mod Selected :(
                    </Text>
                )}
            </Stack>
        </Box>
    );
}

export default App;
