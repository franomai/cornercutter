import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import './App.css';
import useConfigContext from './context/ConfigContext';
import AllFloorsConfig from './pages/AllFloorsConfig';
import FloorConfig from './pages/FloorConfig';
import GeneralConfig from './pages/GeneralConfig';
import StartingConfig from './pages/StartingConfig';
import { getAllSkills } from './redux/slices/skills';
import { Floor, Options } from './types/Configuration';
import TabData from './types/TabData';
import { optionsHasFlag } from './utility/ConfigHelpers';

function App() {
    const skills = useSelector(getAllSkills);
    const [config, setConfig] = useConfigContext();

    console.log(skills);

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
        <Box className="App" h="full" py={5}>
            <Container maxW="80%" h="full">
                <Box borderWidth="1px" py={5} px={10} borderRadius="lg" h="full">
                    {renderTabs()}
                </Box>
            </Container>
        </Box>
    );
}

export default App;
