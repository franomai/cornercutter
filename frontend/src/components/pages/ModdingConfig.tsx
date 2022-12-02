import NewMod from '../modals/NewMod';
import ModList from '../mods/ModList';
import TabData from '../../types/TabData';
import Settings from '../modals/Settings';
import TabBar from '../tabs/common/TabBar';
import ImportMod from '../modals/ImportMod';
import ModConfig from '../../types/Configuration';
import FindGoingUnder from '../modals/FirstStartup';
import FloorConfigTab from '../tabs/FloorConfigTab';
import BlankTextLayout from '../layout/BlankTextLayout';
import SkillSearchColumn from '../skills/search/SkillSearchColumn';
import SavingIndicator from '../tabs/common/saving/SavingIndicator';
import GeneralConfigTab from '../tabs/generalconfig/GeneralConfigTab';

import { useSelector } from 'react-redux';
import { ReactNode, useCallback, useRef } from 'react';
import { hasOptionSet } from '../../utility/ConfigHelpers';
import { Box, Button, Flex, Stack } from '@chakra-ui/react';
import { Floor, ModOptions } from '../../types/enums/ConfigEnums';
import { getAllMods, getSelectedMod } from '../../redux/slices/mod';
import { getCornercutterConfig } from '../../redux/slices/cornercutter';

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

export default function ModdingConfig() {
    const mods = useSelector(getAllMods);
    const selectedMod = useSelector(getSelectedMod);
    const config = useSelector(getCornercutterConfig);
    const openNewModRef = useRef<HTMLButtonElement>(null);
    const openSettingsRef = useRef<HTMLButtonElement>(null);
    const openImportModRef = useRef<HTMLButtonElement>(null);

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
                <TabBar tabs={getTabs(selectedMod)} />
                <Stack alignItems="flex-end">
                    <Box minH="42px" w="full" maxW="full">
                        <SavingIndicator />
                    </Box>
                    <SkillSearchColumn />
                </Stack>
            </Flex>
        );
    }, [mods, selectedMod, getTabs]);

    return (
        <Box display="flex" flexDirection="row" h="full" maxW="full" w="full" overflowX="hidden">
            <ModList>
                <Button variant="outline" w="full" ref={openNewModRef}>
                    New Mod
                </Button>
                <Button variant="outline" w="full" ref={openImportModRef}>
                    Import Mod
                </Button>
                <Button variant="outline" w="full" ref={openSettingsRef}>
                    Global Settings
                </Button>
            </ModList>
            {renderLayout()}
            {config && <FindGoingUnder config={config} />}
            <Settings openRef={openSettingsRef} />
            <NewMod openRef={openNewModRef} />
            <ImportMod openRef={openImportModRef} />
        </Box>
    );
}
