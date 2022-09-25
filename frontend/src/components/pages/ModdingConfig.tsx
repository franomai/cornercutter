import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    useDisclosure,
} from '@chakra-ui/react';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getCornercutterConfig } from '../../redux/slices/cornercutter';
import { getAllMods, getSelectedMod } from '../../redux/slices/mod';
import ModConfig, { Floor, Options } from '../../types/Configuration';
import TabData from '../../types/TabData';
import { modHasOption } from '../../utility/ConfigHelpers';
import BlankTextLayout from '../layout/BlankTextLayout';
import FindGoingUnder from '../modals/FindGoingUnder';
import ModList from '../mods/ModList';
import FloorConfigTab from '../tabs/FloorConfigTab';
import GeneralConfigTab from '../tabs/generalconfig';

const ModdingConfig = () => {
    const mods = useSelector(getAllMods);
    const config = useSelector(getCornercutterConfig);
    const selectedMod = useSelector(getSelectedMod);

    const getTabs = useCallback(
        (selectedMod: ModConfig): TabData[] => {
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
        },
        [selectedMod],
    );

    const renderLayout = useCallback((): ReactNode => {
        if (!selectedMod) {
            return (
                <BlankTextLayout
                    title="No Mod Selected"
                    subtitle={
                        Object.keys(mods).length === 0
                            ? 'Create a mod in the left pane to get started'
                            : 'Select a mod in the left pane to get started'
                    }
                />
            );
        }

        const tabs = getTabs(selectedMod);

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
    }, [selectedMod, mods]);

    return (
        <Box display="flex" flexDirection="row" h="full" maxW="full" w="full" overflowX="hidden">
            <ModList />
            <Stack direction="column" h="full" w="full" maxW="full" overflowX="hidden">
                {renderLayout()}
            </Stack>
            {config && <FindGoingUnder config={config} />}
        </Box>
    );
};

export default ModdingConfig;
