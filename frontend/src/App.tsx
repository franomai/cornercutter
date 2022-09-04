import { Box, Container, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { ReactNode, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import useConfigContext from './context/ConfigContext';
import AllFloorsConfig from './components/tabs/AllFloorsConfig';
import FloorConfig from './components/tabs/FloorConfig';
import GeneralConfig from './components/tabs/GeneralConfig';
import StartingConfig from './components/tabs/StartingConfig';
import { getAllSkills } from './redux/slices/skills';
import { DEFAULT_CONFIG, Floor, Options } from './types/Configuration';
import TabData from './types/TabData';
import { optionsHasFlag } from './utility/ConfigHelpers';
import ModList from './components/mods/ModList';
import { addMod, getAllMods, getSelectedMod, setEnabledMod, setSelectedMod } from './redux/slices/mod';

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
                page: <GeneralConfig />,
            },
            {
                name: 'StartingConfig',
                page: <StartingConfig />,
            },
        ];

        // This function will only ever be called if there is a selected mod
        if (optionsHasFlag(selectedMod!.general, Options.ConfigPerFloor)) {
            tabs.push(
                { name: 'Floor 1', page: <FloorConfig floor={Floor.FirstFloor} /> },
                { name: 'Floor 2', page: <FloorConfig floor={Floor.SecondFloor} /> },
                { name: 'Floor 3', page: <FloorConfig floor={Floor.ThirdFloor} /> },
                { name: 'Boss Floor', page: <FloorConfig floor={Floor.Boss} /> },
            );
        } else {
            tabs.push({ name: 'Floor Config', page: <AllFloorsConfig /> });
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
                        <TabPanel key={tab.name} h="full">
                            {tab.page}
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
