import { Box, Container, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import useConfigContext from './context/ConfigContext';
import AllFloorsConfig from './components/pages/AllFloorsConfig';
import FloorConfig from './components/pages/FloorConfig';
import GeneralConfig from './components/pages/GeneralConfig';
import StartingConfig from './components/pages/StartingConfig';
import { getAllSkills } from './redux/slices/skills';
import { DEFAULT_CONFIG, Floor, Options } from './types/Configuration';
import TabData from './types/TabData';
import { optionsHasFlag } from './utility/ConfigHelpers';
import ModList from './components/mods/ModList';
import { addMod, getCurrentMod, setCurrentMod } from './redux/slices/mod';

function App() {
    const dispatch = useDispatch();
    const currentMod = useSelector(getCurrentMod);
    const [config, setConfig] = useConfigContext();

    useEffect(() => {
        if (currentMod === null) {
            dispatch(
                addMod({
                    info: {
                        name: 'Placeholder mod',
                        description: 'This is a mod description...',
                    },
                    general: DEFAULT_CONFIG,
                }),
            );
            dispatch(setCurrentMod(0));
        }
    }, [dispatch, currentMod]);

    function getTabs(): TabData[] {
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

        // TODO: Try cache components
        if (optionsHasFlag(config, Options.ConfigPerFloor)) {
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
    }

    function renderTabs(): ReactNode {
        const tabs = getTabs();

        return (
            <Tabs h="full" display="flex" style={{ flexDirection: 'column' }} overflowY="hidden">
                <TabList>
                    {tabs.map((tab) => (
                        <Tab fontWeight="semibold">{tab.name}</Tab>
                    ))}
                </TabList>
                <TabPanels h="full">
                    {tabs.map((tab) => (
                        <TabPanel h="full">{tab.page}</TabPanel>
                    ))}
                </TabPanels>
            </Tabs>
        );
    }

    return (
        <Stack direction="row" h="full" w="full">
            <ModList />
            <Box borderWidth="1px" py={5} borderRadius="lg" h="full" w="full">
                {renderTabs()}
            </Box>
        </Stack>
    );
}

export default App;
