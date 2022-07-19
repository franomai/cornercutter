import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import './App.css';
import GeneralConfig from './pages/GeneralConfig';
import StartingConfig from './pages/StartingConfig';

function App() {
    return (
        <Box className="App" h="full" py={5}>
            <Container maxW="80%" h="full">
                <Box borderWidth="1px" py={5} px={10} borderRadius="lg" h="full">
                    <Tabs h="full" display="flex" style={{ flexDirection: 'column' }}>
                        <TabList>
                            <Tab fontWeight="semibold">General Config</Tab>
                            <Tab fontWeight="semibold">Starting Config</Tab>
                        </TabList>
                        <TabPanels h="full">
                            <TabPanel>
                                <GeneralConfig />
                            </TabPanel>
                            <TabPanel h="full">
                                <StartingConfig />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </Container>
        </Box>
    );
}

export default App;
