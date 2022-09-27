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
import { invoke } from '@tauri-apps/api/tauri';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCornercutterConfig } from '../../redux/slices/cornercutter';
import { addMod, getAllMods, getSelectedMod, setSelectedMod } from '../../redux/slices/mod';
import ModConfig, { Floor, Options } from '../../types/Configuration';
import TabData from '../../types/TabData';
import { modHasOption } from '../../utility/ConfigHelpers';
import BlankTextLayout from '../layout/BlankTextLayout';
import FindGoingUnder from '../modals/FindGoingUnder';
import ModList from '../mods/ModList';
import FloorConfigTab from '../tabs/FloorConfigTab';
import GeneralConfigTab from '../tabs/generalconfig';
import NewMod from '../modals/NewMod';
import ImportMod from '../modals/ImportMod';

const ModdingConfig = () => {
    const dispatch = useDispatch();
    const mods = useSelector(getAllMods);
    const config = useSelector(getCornercutterConfig);
    const selectedMod = useSelector(getSelectedMod);

    const [newModId, setNewModId] = useState<string | null>(null);
    const [showImportMod, setShowImportMod] = useState(false);

    const handleNewMod = useCallback(() => {
        invoke<string>('get_new_mod_id')
            .then((id) => setNewModId(id))
            .catch(console.error);
    }, [setNewModId]);

    const handleImportMod = useCallback(() => {
        setShowImportMod(true);
    }, [setShowImportMod]);

    const getTabs = useCallback((selectedMod: ModConfig): TabData[] => {
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
    }, []);

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
    }, [selectedMod, mods, getTabs]);

    return (
        <Box display="flex" flexDirection="row" h="full" maxW="full" w="full" overflowX="hidden">
            <ModList>
                <Button variant="outline" w="full" onClick={handleNewMod}>
                    New Mod
                </Button>
                <Button variant="outline" w="full" onClick={handleImportMod}>
                    Import Mod
                </Button>
            </ModList>
            <Stack direction="column" h="full" w="full" maxW="full" overflowX="hidden">
                {renderLayout()}
            </Stack>
            {config && <FindGoingUnder config={config} />}
            {newModId && (
                <NewMod
                    id={newModId}
                    handleCreate={(mod) => {
                        setNewModId(null);
                        dispatch(addMod(mod));
                        dispatch(setSelectedMod(newModId));
                    }}
                    handleDiscard={() => setNewModId(null)}
                />
            )}
            <ImportMod
                isShown={showImportMod}
                handleCreate={console.log}
                handleDiscard={() => setShowImportMod(false)}
            />
        </Box>
    );
};

export default ModdingConfig;
