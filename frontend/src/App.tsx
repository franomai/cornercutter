import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import './App.css';
import GeneralConfig from './pages/GeneralConfig';
import StartingConfig from './pages/StartingConfig';
import Test from './pages/Test';

function App() {
    return (
        <div className="App">
            <Container my={4} maxW="800px">
                <Box borderWidth="1px" py={5} px={8} borderRadius="lg">
                    <Tabs>
                        <TabList>
                            <Tab fontWeight="semibold">General Config</Tab>
                            <Tab fontWeight="semibold">Starting Config</Tab>
                            <Tab fontWeight="semibold">Test</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <GeneralConfig />
                            </TabPanel>
                            <TabPanel>
                                <StartingConfig />
                            </TabPanel>
                            <TabPanel>
                                <Test />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </Container>
        </div>
    );
}

export default App;
