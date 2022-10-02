import { Checkbox, Radio, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { setCurseSpawns, setMultiSpawners, setOption, setPedestalSpawns, setSpawns } from '../../../redux/slices/mod';
import { saveSelectedMod } from '../../../redux/slices/saving';
import { AppDispatch } from '../../../redux/store';
import ModConfig, { CurseSpawnType, Options, SpawnType, PedestalSpawnType, MultiSpawnerType } from '../../../types/Configuration';
import { modHasOption } from '../../../utility/ConfigHelpers';
import LabelledRadioGroup from '../../forms/LabelledRadioGroup';

const optionLabels: Record<Options, string> = {
    [Options.ConfigPerFloor]: 'Configure spawns per floor',
    [Options.ConfigPerRoom]: 'Configure spawns per room',
    [Options.AwardSkillsPerFloor]: 'Award starting skills per floor',
    [Options.SelectRandomItemOnEmpty]: 'Grant random item when out of mod items',
    [Options.DisableMentorAbilities]: 'Disable mentor abilities',
    [Options.DisableGiftOfIntern]: 'Disable gift of the intern',
    [Options.DisablePinned]: 'Disable pinned skills',
};

const GeneralOptions = ({ selectedMod }: { selectedMod: ModConfig }) => {
    const dispatch = useDispatch<AppDispatch>();

    function renderOptionCheckbox(flag: Options, label: string): ReactNode {
        return (
            <Checkbox
                key={flag}
                isChecked={modHasOption(selectedMod, flag)}
                onChange={(e) => {
                    dispatch(setOption({ flag, isEnabled: e.target.checked }));
                    dispatch(saveSelectedMod());
                }}
            >
                {label}
            </Checkbox>
        );
    }

    function renderOptionCheckboxes(flags: Options[]): ReactNode {
        return <Stack spacing={2}>{flags.map((flag) => renderOptionCheckbox(flag, optionLabels[flag]))}</Stack>;
    }

    return (
        <Stack spacing={6}>
            <Text fontSize="2xl" fontWeight="bold">
                Options
            </Text>
            <SimpleGrid columns={{ sm: 1, xl: 2 }} spacingX={2} spacingY={6}>
                <LabelledRadioGroup
                    title="Skill Spawns"
                    tooltip="Select how skills should be spawned."
                    value={selectedMod.general.spawns}
                    onChange={(newValue) => {
                        dispatch(setSpawns(newValue as SpawnType));
                        dispatch(saveSelectedMod());
                    }}
                >
                    <Radio value="Looped">Looped</Radio>
                    <Radio value="Weighted">Weighted</Radio>
                    <Radio value="Consecutive">Consecutive</Radio>
                </LabelledRadioGroup>
                <LabelledRadioGroup
                    title="Curse Room Spawns"
                    tooltip="Select when the curse room should spawn."
                    value={selectedMod.general.curseSpawns}
                    onChange={(newValue) => {
                        dispatch(setCurseSpawns(newValue as CurseSpawnType));
                        dispatch(saveSelectedMod());
                    }}
                >
                    <Radio value="Randomly">Randomly</Radio>
                    <Radio value="Always">Always</Radio>
                    <Radio value="AlwaysIfAble">Always if able</Radio>
                    <Radio value="Never">Never</Radio>
                </LabelledRadioGroup>
                <LabelledRadioGroup
                    title="Pedestal Spawns"
                    tooltip="Select when a pedestal room should spawn."
                    value={selectedMod.general.pedestalSpawns}
                    onChange={(newValue) => {
                        dispatch(setPedestalSpawns(newValue as PedestalSpawnType));
                        dispatch(saveSelectedMod());
                    }}
                >
                    <Radio value="Randomly">Randomly</Radio>
                    <Radio value="AlwaysFirstFloor">First floor</Radio>
                    <Radio value="AlwaysLastFloor">Last floor</Radio>
                    <Radio value="Never">Never</Radio>
                </LabelledRadioGroup>
                <LabelledRadioGroup
                    title="Multispawner Types"
                    tooltip="Select what spawners that can spawn different things can spawn - for example, in the curse room."
                    value={selectedMod.general.multiSpawners}
                    onChange={(newValue) => {
                        dispatch(setMultiSpawners(newValue as MultiSpawnerType));
                        dispatch(saveSelectedMod());
                    }}
                >
                    <Radio value="Randomly">Random</Radio>
                    <Radio value="AlwaysSkillIfAble">Only skills</Radio>
                    <Radio value="Never">Never skills</Radio>
                </LabelledRadioGroup>
                {renderOptionCheckboxes([
                    Options.ConfigPerFloor,
                    Options.ConfigPerRoom,
                    Options.AwardSkillsPerFloor,
                    Options.SelectRandomItemOnEmpty
                ])}
                {renderOptionCheckboxes([
                    Options.DisableMentorAbilities,
                    Options.DisableGiftOfIntern,
                    Options.DisablePinned,
                ])}
            </SimpleGrid>
        </Stack>
    );
};

export default GeneralOptions;
