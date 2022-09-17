import { FC, ReactNode, useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    Flex,
    FormLabel,
    Icon,
    IconButton,
    Radio,
    RadioGroup,
    SimpleGrid,
    Stack,
    Text,
} from '@chakra-ui/react';
import Configuration, { CurseSpawnType, SpawnType, Options } from '../../../types/Configuration';
import { invoke } from '@tauri-apps/api';
import { convertKeysToSnakeCase } from '../../../utility/Utils';
import useConfigContext from '../../../context/ConfigContext';
import { modHasOption, setModOptionFlag } from '../../../utility/ConfigHelpers';
import ContentContainer from '../ContentContainer';
import { useDispatch, useSelector } from 'react-redux';
import mod, {
    addStartingSkill,
    clearStartingSkills,
    deleteStartingSkill,
    getSelectedMod,
    setCurseSpawns,
    setOption,
    setSpawns,
} from '../../../redux/slices/mod';
import { faArrowUpFromBracket, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LabelledRadioGroup from './LabelledRadioGroup';
import { SkillSearchColumn } from '../../searchbar';
import Dropzone from '../../dropzone/Dropzone';
import { getAllSkills } from '../../../redux/slices/skills';
import ModConfig from '../../../types/Configuration';
import LabelledDropzone from '../../dropzone';

const optionLabels: Record<Options, string> = {
    [Options.ConfigPerFloor]: 'Configure spawns per floor',
    [Options.ConfigPerRoom]: 'Configure spawns per room',
    [Options.AwardSkillsPerFloor]: 'Award starting skills per floor',
    [Options.RemoveHealingItems]: 'Remove healing items',
    [Options.DisableMentorAbilities]: 'Disable mentor abilities',
    [Options.DisableGiftOfIntern]: 'Disable gift of the intern',
    [Options.DisablePinned]: 'Disable pinned skills',
};

const GeneralConfigTab = ({ selectedMod }: { selectedMod: ModConfig }) => {
    const dispatch = useDispatch();
    const allSkills = useSelector(getAllSkills);

    // async function submitConfig() {
    //     const res = await invoke<string>('accept_config', { config: convertKeysToSnakeCase(config) });
    // }

    function renderActionButtons(): ReactNode {
        return (
            <Stack direction="row" spacing={1.5}>
                <IconButton
                    variant="ghost"
                    title="Export mod config code"
                    aria-label="Export mod config code"
                    icon={<FontAwesomeIcon icon={faArrowUpFromBracket} size="lg" />}
                />
                <IconButton
                    variant="ghost"
                    title="Edit mod config name and description"
                    aria-label="Edit mod config name and description"
                    icon={<FontAwesomeIcon icon={faPenToSquare} size="lg" />}
                />
                <IconButton
                    variant="ghost"
                    title="Delete mod"
                    aria-label="Delete mod"
                    icon={<FontAwesomeIcon icon={faTrash} size="lg" />}
                />
            </Stack>
        );
    }

    function renderOptionCheckbox(flag: Options, label: string): ReactNode {
        return (
            <Checkbox
                key={flag}
                isChecked={modHasOption(selectedMod, flag)}
                onChange={(e) => dispatch(setOption({ flag, isEnabled: e.target.checked }))}
            >
                {label}
            </Checkbox>
        );
    }

    function renderOptionCheckboxes(flags: Options[]): ReactNode {
        return <Stack spacing={2}>{flags.map((flag) => renderOptionCheckbox(flag, optionLabels[flag]))}</Stack>;
    }

    return (
        <Stack direction="row" maxH="full" h="full" overflow="hidden">
            <ContentContainer>
                <Stack spacing={2}>
                    <Flex direction="row" justifyContent="space-between">
                        <Text fontSize="3xl" fontWeight="bold">
                            {selectedMod.info.name}
                        </Text>
                        {renderActionButtons()}
                    </Flex>
                    <Text>{selectedMod.info.description}</Text>
                </Stack>
                <Stack spacing={6}>
                    <Text fontSize="2xl" fontWeight="bold">
                        Options
                    </Text>
                    <SimpleGrid columns={{ sm: 1, xl: 2 }} spacingX={2} spacingY={6}>
                        <LabelledRadioGroup
                            title="Skill Spawns"
                            tooltip="Select how skills should be spawned"
                            value={selectedMod.general.spawns}
                            onChange={(newValue) => dispatch(setSpawns(newValue as SpawnType))}
                        >
                            <Radio value="Looped">Looped</Radio>
                            <Radio value="Weighted">Weighted</Radio>
                            <Radio value="Consecutive">Consecutive</Radio>
                        </LabelledRadioGroup>
                        <LabelledRadioGroup
                            title="Curse Room Spawns"
                            tooltip="Select when the curse room should spawn"
                            value={selectedMod.general.curseSpawns}
                            onChange={(newValue) => dispatch(setCurseSpawns(newValue as CurseSpawnType))}
                        >
                            <Radio value="Randomly">Randomly</Radio>
                            <Radio value="Always">Always</Radio>
                            <Radio value="Never">Never</Radio>
                        </LabelledRadioGroup>
                        {renderOptionCheckboxes([
                            Options.ConfigPerFloor,
                            Options.ConfigPerRoom,
                            Options.AwardSkillsPerFloor,
                            Options.RemoveHealingItems,
                        ])}
                        {renderOptionCheckboxes([
                            Options.DisableMentorAbilities,
                            Options.DisableGiftOfIntern,
                            Options.DisablePinned,
                        ])}
                    </SimpleGrid>
                </Stack>
                <LabelledDropzone
                    label="Starting Skills"
                    skills={selectedMod.general.startingSkills}
                    handleDropSkill={(skillId) => dispatch(addStartingSkill(skillId))}
                    handleDeleteSkill={(skillIndex) => dispatch(deleteStartingSkill(skillIndex))}
                    handleClearAllSkills={() => dispatch(clearStartingSkills())}
                />
            </ContentContainer>
            <SkillSearchColumn />
        </Stack>
    );
};

export default GeneralConfigTab;
