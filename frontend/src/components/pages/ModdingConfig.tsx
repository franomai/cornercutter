import { Box, Button, Flex, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { invoke } from '@tauri-apps/api/tauri';
import { ReactNode, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCornercutterConfig, setGlobalOptions } from '../../redux/slices/cornercutter';
import { addMod, getAllMods, getSelectedMod, setSelectedMod } from '../../redux/slices/mod';
import ModConfig, { Floor, ModOptions, GlobalOptions } from '../../types/Configuration';
import TabData from '../../types/TabData';
import { hasOptionSet } from '../../utility/ConfigHelpers';
import BlankTextLayout from '../layout/BlankTextLayout';
import FindGoingUnder from '../modals/FindGoingUnder';
import ModList from '../mods/ModList';
import FloorConfigTab from '../tabs/FloorConfigTab';
import GeneralConfigTab from '../tabs/generalconfig';
import NewMod from '../modals/NewMod';
import ImportMod from '../modals/ImportMod';
import { SkillSearchColumn } from '../skills/searchbar';
import Savingstatus from '../savingstatus';
import Settings from '../modals/Settings';
import useGoogleAnalytics from '../../hooks/useGoogleAnalytics';

interface FloorData {
    name: string;
    floor: Floor;
}

const SpecificFloorsData: FloorData[] = [
    {
        name: 'Floor 1',
        floor: Floor.FirstFloor,
    },
    {
        name: 'Floor 2',
        floor: Floor.SecondFloor,
    },
    {
        name: 'Floor 3',
        floor: Floor.ThirdFloor,
    },
    {
        name: 'Boss Floor',
        floor: Floor.Boss,
    },
];

const ModdingConfig = () => {
    const dispatch = useDispatch();
    const mods = useSelector(getAllMods);
    const config = useSelector(getCornercutterConfig);
    const selectedMod = useSelector(getSelectedMod);
    const GA = useGoogleAnalytics();

    const [newModId, setNewModId] = useState<string | null>(null);
    const [showImportMod, setShowImportMod] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const handleNewMod = useCallback(() => {
        invoke<string>('get_new_mod_id')
            .then((id) => setNewModId(id))
            .catch(console.error);
    }, [setNewModId]);

    const handleImportMod = useCallback(() => {
        setShowImportMod(true);
    }, [setShowImportMod]);

    const handleSaveSettings = useCallback(
        (globalOptions: GlobalOptions) => {
            setShowSettings(false);
            invoke('set_global_options', { options: globalOptions }).then(() => {
                dispatch(setGlobalOptions(globalOptions));
            });
        },
        [setShowSettings, dispatch],
    );

    const getTabs = useCallback((selectedMod: ModConfig): TabData[] => {
        const tabs: TabData[] = [
            {
                name: 'General Config',
                tab: <GeneralConfigTab selectedMod={selectedMod} />,
            },
        ];

        if (hasOptionSet(selectedMod.general.options, ModOptions.ConfigPerFloor)) {
            tabs.push(
                ...SpecificFloorsData.map((floorData) => ({
                    name: floorData.name,
                    tab: <FloorConfigTab selectedMod={selectedMod} floor={floorData.floor} />,
                })),
            );
        } else {
            tabs.push({
                name: 'All Floors',
                tab: <FloorConfigTab selectedMod={selectedMod} floor={Floor.AllFloors} />,
            });
        }

        return tabs;
    }, []);

    const trackSwitchTab = useCallback(
        (tab: string) => {
            GA.send({ hitType: 'pageview', page: tab });
        },
        [GA],
    );

    const renderTabs = useCallback(
        (selectedMod: ModConfig): ReactNode => {
            const tabs = getTabs(selectedMod);

            return (
                <Tabs
                    h="full"
                    w="full"
                    maxW="full"
                    display="flex"
                    style={{ flexDirection: 'column' }}
                    overflow="hidden"
                >
                    <TabList background="blackAlpha.200" w="full">
                        {tabs.map((tab) => (
                            <Tab
                                key={tab.name}
                                fontWeight="semibold"
                                pt={5}
                                pb={3}
                                onClick={() => trackSwitchTab(tab.name)}
                            >
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
        },
        [trackSwitchTab, getTabs],
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

        return (
            <Flex flexDirection="row" w="full" overflow="hidden">
                {renderTabs(selectedMod)}
                <Stack alignItems="flex-end">
                    <Box minH="58px" w="full" maxW="full">
                        <Savingstatus />
                    </Box>
                    <SkillSearchColumn />
                </Stack>
            </Flex>
        );
    }, [selectedMod, mods, renderTabs]);

    return (
        <Box display="flex" flexDirection="row" h="full" maxW="full" w="full" overflowX="hidden">
            <ModList>
                <Button variant="outline" w="full" onClick={handleNewMod}>
                    New Mod
                </Button>
                <Button variant="outline" w="full" onClick={handleImportMod}>
                    Import Mod
                </Button>
                <Button variant="outline" w="full" onClick={() => setShowSettings(true)}>
                    Global Settings
                </Button>
            </ModList>
            {renderLayout()}
            {config && <FindGoingUnder config={config} />}
            {showSettings && (
                <Settings
                    isShown={showSettings}
                    handleSaveChanges={handleSaveSettings}
                    handleDiscardChanges={() => setShowSettings(false)}
                />
            )}
            {newModId && (
                <NewMod
                    id={newModId}
                    handleCreate={(mod) => {
                        setNewModId(null);
                        dispatch(addMod(mod));
                        dispatch(setSelectedMod(mod.id));
                    }}
                    handleDiscard={() => setNewModId(null)}
                />
            )}
            <ImportMod
                isShown={showImportMod}
                handleCreate={(mod) => {
                    setShowImportMod(false);
                    dispatch(addMod(mod));
                    dispatch(setSelectedMod(mod.id));
                }}
                handleDiscard={() => setShowImportMod(false)}
            />
        </Box>
    );
};

export default ModdingConfig;
