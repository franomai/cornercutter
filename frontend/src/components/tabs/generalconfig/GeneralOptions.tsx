import ModConfig from '../../../types/Configuration';
import TooltipRadio from '../../forms/TooltipRadio';
import OptionCheckboxes from '../../forms/OptionCheckboxes';
import useSavingContext from '../../../contexts/SavingContext';
import LabelledRadioGroup from '../../forms/LabelledRadioGroup';

import { useDispatch } from 'react-redux';
import { ReactNode, useCallback } from 'react';
import { SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { generalModOptionDetails, ModOptions } from '../../../types/enums/ModOptions';
import { SpawnType, CurseSpawnType, MultiSpawnerType, PedestalSpawnType } from '../../../types/enums/ConfigEnums';
import { setCurseSpawns, setMultiSpawners, setOption, setPedestalSpawns, setSpawns } from '../../../redux/slices/mod';

export default function GeneralOptions({ selectedMod }: { selectedMod: ModConfig }) {
    const dispatch = useDispatch();
    const { saveSelectedMod } = useSavingContext();

    const renderOptionCheckboxes = useCallback(
        (flags: ModOptions[]): ReactNode => {
            return (
                <OptionCheckboxes<ModOptions>
                    flags={flags}
                    optionDetails={generalModOptionDetails}
                    options={selectedMod.general.options}
                    handleChange={(flag, isEnabled) => {
                        dispatch(setOption({ flag, isEnabled }));
                        saveSelectedMod();
                    }}
                />
            );
        },
        [selectedMod.general.options, dispatch, saveSelectedMod],
    );

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
                        saveSelectedMod();
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
                        saveSelectedMod();
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
                    <TooltipRadio tooltip="Never create a curse room, even if it should be guaranteed." value="Never">
                        Never
                    </TooltipRadio>
                </LabelledRadioGroup>
                <LabelledRadioGroup
                    title="Pedestal Spawns"
                    tooltip="Selects when a pedestal room should spawn."
                    value={selectedMod.general.pedestalSpawns}
                    onChange={(newValue) => {
                        dispatch(setPedestalSpawns(newValue as PedestalSpawnType));
                        saveSelectedMod();
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
                        saveSelectedMod();
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
                    ModOptions.ConfigPerFloor,
                    ModOptions.ConfigPerRoom,
                    ModOptions.AwardSkillsPerFloor,
                    ModOptions.DisableHealing,
                    ModOptions.SelectRandomItemOnEmpty,
                ])}
                {renderOptionCheckboxes([
                    ModOptions.DisableMentorAbilities,
                    ModOptions.DisableGiftOfIntern,
                    ModOptions.DisablePinned,
                    ModOptions.DisableItemPickup,
                ])}
            </SimpleGrid>
        </Stack>
    );
}
