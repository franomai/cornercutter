import { Checkbox, Tooltip, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { setCurseSpawns, setMultiSpawners, setOption, setPedestalSpawns, setSpawns } from '../../../redux/slices/mod';
import { saveSelectedMod } from '../../../redux/slices/saving';
import { AppDispatch } from '../../../redux/store';
import ModConfig, {
    CurseSpawnType,
    Options,
    SpawnType,
    PedestalSpawnType,
    MultiSpawnerType,
} from '../../../types/Configuration';
import { modHasOption } from '../../../utility/ConfigHelpers';
import LabelledRadioGroup from '../../forms/LabelledRadioGroup';
import TooltipRadio from '../../forms/TooltipRadio';

const optionLabels: Record<Options, string> = {
    [Options.ConfigPerFloor]: 'Configure spawns per floor',
    [Options.ConfigPerRoom]: 'Configure spawns per room',
    [Options.AwardSkillsPerFloor]: 'Award starting skills per floor',
    [Options.SelectRandomItemOnEmpty]: 'Grant random item when out of mod items',
    [Options.DisableMentorAbilities]: 'Disable mentor abilities',
    [Options.DisableGiftOfIntern]: 'Disable gift of the intern',
    [Options.DisablePinned]: 'Disable pinned skills',
};

const optionTooltips: Record<Options, string> = {
    [Options.ConfigPerFloor]: 'Set skills up on a floor by floor basis.',
    [Options.ConfigPerRoom]: 'Set skills up based on room type / function. Non-applicable types will be ignored (for example, finale for boss floors).',
    [Options.AwardSkillsPerFloor]: 'Enabling this will grant starting skills at the start of every floor. Otherwise, they will only be granted on dungeon start.',
    [Options.SelectRandomItemOnEmpty]: 'If a spawn pool runs out, or a pool has no skills added, enabling this will fallback to the usual spawner logic for that room. Otherwise, gift of the intern will spawn.',
    [Options.DisableMentorAbilities]: 'When enabled, any mentor abilities will be deactivated.',
    [Options.DisableGiftOfIntern]: 'Gift of the intern is a fallback skill that spawns when nothing else can, granting a small bonus (cash, an app, health, etc.) - enabling this will spawn nothing instead.',
    [Options.DisablePinned]: 'When enabled, the pinned skill will not be granted at the start of the dungeon,',
};

const GeneralOptions = ({ selectedMod }: { selectedMod: ModConfig }) => {
    const dispatch = useDispatch<AppDispatch>();

    function renderOptionCheckbox(flag: Options, label: string, tooltip: string): ReactNode {
        return (
            <Checkbox
                key={flag}
                isChecked={modHasOption(selectedMod, flag)}
                onChange={(e) => {
                    dispatch(setOption({ flag, isEnabled: e.target.checked }));
                    dispatch(saveSelectedMod());
                }}
            >
                <Tooltip hasArrow label={tooltip} aria-label="More info" placement="top" openDelay={700}>
                    {label}
                </Tooltip>
                
            </Checkbox>
        );
    }

    function renderOptionCheckboxes(flags: Options[]): ReactNode {
        return <Stack spacing={2}>{flags.map((flag) => renderOptionCheckbox(flag, optionLabels[flag], optionTooltips[flag]))}</Stack>;
    }

    return (
        <Stack spacing={6}>
            <Text fontSize="2xl" fontWeight="bold">
                Options
            </Text>
            <SimpleGrid columns={{ sm: 1, xl: 2 }} spacingX={2} spacingY={6}>
                <LabelledRadioGroup
                    title="Skill Spawns"
                    tooltip="Selects how skills should be spawned for all spawners."
                    value={selectedMod.general.spawns}
                    onChange={(newValue) => {
                        dispatch(setSpawns(newValue as SpawnType));
                        dispatch(saveSelectedMod());
                    }}
                >
                    <TooltipRadio
                        tooltip="Pick values from the pool, left to right, then go back to the first one when there are no more left."
                        value="Looped"
                    >
                        Looped
                    </TooltipRadio>
                    <TooltipRadio
                        tooltip="A dice will be rolled to select skills, using the chances you've set. For example, one at 10 and a second at 20 means you are twice as likely to get the second item."
                        value="Weighted"
                    >
                        Weighted
                    </TooltipRadio>
                    <TooltipRadio
                        tooltip="Pick values from the pool, left to right. At the end, either a random item, gift of the intern, or nothing will be selected, depending on mod settings."
                        value="Consecutive"
                    >
                        Consecutive
                    </TooltipRadio>
                </LabelledRadioGroup>
                <LabelledRadioGroup
                    title="Curse Room Spawns"
                    tooltip="Selects when the curse room should spawn."
                    value={selectedMod.general.curseSpawns}
                    onChange={(newValue) => {
                        dispatch(setCurseSpawns(newValue as CurseSpawnType));
                        dispatch(saveSelectedMod());
                    }}
                >
                    <TooltipRadio
                        tooltip="Don't change anything, use the game's original spawn chance."
                        value="Randomly"
                    >
                        Randomly
                    </TooltipRadio>
                    <TooltipRadio
                        tooltip="Always create a curse room if there is space for it, even when the chance for it should be 0."
                        value="Always"
                    >
                        Always
                    </TooltipRadio>
                    <TooltipRadio
                        tooltip="Always create a curse room if there is a chance to spawn it. This stops spawns where the chance is 0, like the boss floor."
                        value="AlwaysIfAble"
                    >
                        Always if able
                    </TooltipRadio>
                    <TooltipRadio
                        tooltip="Never create a curse room, even if it should be guaranteed."
                        value="Never"
                    >
                        Never
                    </TooltipRadio>
                </LabelledRadioGroup>
                <LabelledRadioGroup
                    title="Pedestal Spawns"
                    tooltip="Selects when a pedestal room should spawn."
                    value={selectedMod.general.pedestalSpawns}
                    onChange={(newValue) => {
                        dispatch(setPedestalSpawns(newValue as PedestalSpawnType));
                        dispatch(saveSelectedMod());
                    }}
                >
                    <TooltipRadio
                        tooltip="Don't change anything, use the game's original spawn chance."
                        value="Randomly"
                    >
                        Randomly
                    </TooltipRadio>
                    <TooltipRadio
                        tooltip="Guarantee a pedestal room on the first floor of the dungeon."
                        value="AlwaysFirstFloor"
                    >
                        First floor
                    </TooltipRadio>
                    <TooltipRadio
                        tooltip="Guarantee a pedestal room on the last floor of the dungeon."
                        value="AlwaysLastFloor"
                    >
                        Last floor
                    </TooltipRadio>
                    <TooltipRadio
                        tooltip="Never create a pedestal room, even if it should be guaranteed."
                        value="Never"
                    >
                        Never
                    </TooltipRadio>
                </LabelledRadioGroup>
                <LabelledRadioGroup
                    title="Multispawner Types"
                    tooltip="Selects what spawners that have some randomness actually can spawn - for example, in the curse room."
                    value={selectedMod.general.multiSpawners}
                    onChange={(newValue) => {
                        dispatch(setMultiSpawners(newValue as MultiSpawnerType));
                        dispatch(saveSelectedMod());
                    }}
                >
                    <TooltipRadio
                        tooltip="Don't change anything, use the game's original distribution."
                        value="Randomly"
                    >
                        Randomly
                    </TooltipRadio>
                    <TooltipRadio
                        tooltip="Always spawn a skill if it is an option - for example, Tappi kiosks or pedestals."
                        value="AlwaysSkillIfAble"
                    >
                        Only skills
                    </TooltipRadio>
                    <TooltipRadio
                        tooltip="Never spawn a skill if it is an option and there are other options available."
                        value="Never"
                    >
                        Never
                    </TooltipRadio>
                </LabelledRadioGroup>
                {renderOptionCheckboxes([
                    Options.ConfigPerFloor,
                    Options.ConfigPerRoom,
                    Options.AwardSkillsPerFloor,
                    Options.SelectRandomItemOnEmpty,
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
