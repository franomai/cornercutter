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
    const [response, setResponse] = useState<string>('');
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
        setResponse(res);
    }

    function renderActionButtons(): ReactNode {
        return (
            <Box>
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
            </Box>
        );
    }

    function renderOptionCheckbox(flag: Options, label: string): ReactNode {
        return (
            <Checkbox
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
        <ContentContainer>
            <Stack spacing={7}>
                <Stack spacing={1}>
                    <Flex direction="row" justifyContent="space-between">
                        <Text fontSize="3xl" fontWeight="bold">
                            {selectedMod?.info.name}
                        </Text>
                        {renderActionButtons()}
                    </Flex>
                    <Text>{selectedMod?.info.description}</Text>
                </Stack>
                <Stack spacing={3}>
                    <Text fontSize="2xl" fontWeight="bold">
                        Options
                    </Text>
                    <SimpleGrid columns={2} spacing={2}>
                        <Stack spacing={3.5}>
                            <LabelledRadioGroup title="Skill Spawns" tooltip="Select how skills should be spawned">
                                <Radio value="Looped">Looped</Radio>
                                <Radio value="Weighted">Weighted</Radio>
                                <Radio value="Consecutive">Consecutive</Radio>
                            </LabelledRadioGroup>
                            {renderOptionCheckboxes([
                                Options.ConfigPerFloor,
                                Options.ConfigPerRoom,
                                Options.AwardSkillsPerFloor,
                                Options.RemoveHealingItems,
                            ])}
                        </Stack>
                        <Stack spacing={3.5}>
                            <LabelledRadioGroup
                                title="Curse Room Spawns"
                                tooltip="Select when the curse room should spawn"
                            >
                                <Radio value="Randomly">Randomly</Radio>
                                <Radio value="Always">Always</Radio>
                                <Radio value="Never">Never</Radio>
                            </LabelledRadioGroup>
                            {renderOptionCheckboxes([
                                Options.DisableMentorAbilities,
                                Options.DisableGiftOfIntern,
                                Options.DisablePinned,
                            ])}
                        </Stack>
                    </SimpleGrid>
                </Stack>
            </Stack>
        </ContentContainer>
    );
};

export default GeneralConfigTab;
