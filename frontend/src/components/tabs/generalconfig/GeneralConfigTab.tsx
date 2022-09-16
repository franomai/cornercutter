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
import { optionsHasFlag, setOptionFlag } from '../../../utility/ConfigHelpers';
import ContentContainer from '../ContentContainer';
import { useSelector } from 'react-redux';
import { getSelectedMod } from '../../../redux/slices/mod';
import { faArrowUpFromBracket, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LabelledRadioGroup from './LabelledRadioGroup';
import { SkillSearchColumn } from '../../searchbar';

const optionLabels: Record<Options, string> = {
    [Options.ConfigPerFloor]: 'Configure spawns per floor',
    [Options.ConfigPerRoom]: 'Configure spawns per room',
    [Options.AwardSkillsPerFloor]: 'Award starting skills per floor',
    [Options.RemoveHealingItems]: 'Remove healing items',
    [Options.DisableMentorAbilities]: 'Disable mentor abilities',
    [Options.DisableGiftOfIntern]: 'Disable gift of the intern',
    [Options.DisablePinned]: 'Disable pinned skills',
};

const GeneralConfigTab: FC = () => {
    const [config, setConfig] = useConfigContext();

    const selectedMod = useSelector(getSelectedMod);

    function setConfigOption(flag: Options, isSet: boolean) {
        setConfig((config) => {
            const newConfig = { ...config };
            setOptionFlag(newConfig, flag, isSet);
            return newConfig;
        });
    }

    async function submitConfig() {
        const res = await invoke<string>('accept_config', { config: convertKeysToSnakeCase(config) });
    }

    function renderActionButtons(): ReactNode {
        return (
            <Stack direction="row" spacing={1}>
                <IconButton
                    variant="ghost"
                    title="Export mod config code"
                    aria-label="Export mod config code"
                    icon={<FontAwesomeIcon icon={faArrowUpFromBracket} />}
                />
                <IconButton
                    variant="ghost"
                    title="Delete mod"
                    aria-label="Delete mod"
                    icon={<FontAwesomeIcon icon={faTrash} />}
                />
            </Stack>
        );
    }

    function renderOptionCheckbox(flag: Options, label: string): ReactNode {
        return (
            <Checkbox
                key={flag}
                isChecked={optionsHasFlag(config, flag)}
                onChange={(e) => setConfigOption(flag, e.target.checked)}
            >
                {label}
            </Checkbox>
        );
    }

    function renderOptionCheckboxes(flags: Options[]): ReactNode {
        return <Stack spacing={2}>{flags.map((flag) => renderOptionCheckbox(flag, optionLabels[flag]))}</Stack>;
    }

    return (
        <Stack direction="row" h="full">
            <ContentContainer>
                <Stack spacing={8}>
                    <Stack spacing={2}>
                        <Flex direction="row" justifyContent="space-between">
                            <Text fontSize="3xl" fontWeight="bold">
                                {selectedMod?.info.name}
                            </Text>
                            {renderActionButtons()}
                        </Flex>
                        <Text>{selectedMod?.info.description}</Text>
                    </Stack>
                    <Stack spacing={6}>
                        <Text fontSize="2xl" fontWeight="bold">
                            Options
                        </Text>
                        <SimpleGrid columns={{ sm: 1, xl: 2 }} spacingX={2} spacingY={6}>
                            <LabelledRadioGroup title="Skill Spawns" tooltip="Select how skills should be spawned">
                                <Radio value="Looped">Looped</Radio>
                                <Radio value="Weighted">Weighted</Radio>
                                <Radio value="Consecutive">Consecutive</Radio>
                            </LabelledRadioGroup>
                            <LabelledRadioGroup
                                title="Curse Room Spawns"
                                tooltip="Select when the curse room should spawn"
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
                    <Stack spacing={3}>
                        <Text fontSize="2xl" fontWeight="bold">
                            Starting Skills
                        </Text>
                    </Stack>
                </Stack>
            </ContentContainer>
            <SkillSearchColumn />
        </Stack>
    );
};

export default GeneralConfigTab;
