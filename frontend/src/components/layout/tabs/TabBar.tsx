import TabData from '../../../types/TabData';
import useGoogleAnalytics from '../../../hooks/useGoogleAnalytics';

import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

interface TabBarProps {
    tabs: TabData[];
}

export default function TabBar({ tabs }: TabBarProps) {
    const GA = useGoogleAnalytics();

    return (
        <Tabs h="full" w="full" maxW="full" display="flex" style={{ flexDirection: 'column' }} overflow="hidden">
            <TabList background="blackAlpha.200" w="full">
                {tabs.map((tab) => (
                    <Tab
                        key={tab.name}
                        fontWeight="semibold"
                        onClick={() => GA.send({ hitType: 'pageview', page: tab.name })}
                    >
                        {tab.name}
                    </Tab>
                ))}
            </TabList>
            {/* Height subtracted is the height of the TabList */}
            <TabPanels minH="calc(100% - 42px)" maxH="calc(100% - 58px)">
                {tabs.map((tab) => (
                    <TabPanel key={tab.name} h="full" p={0}>
                        {tab.tab}
                    </TabPanel>
                ))}
            </TabPanels>
        </Tabs>
    );
}
