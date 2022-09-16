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
                <Stack spacing={4}>
                    <div>
                        <FormLabel>Weapon spawns</FormLabel>
                        <RadioGroup
                            value={config.spawns}
                            onChange={(type) => setConfig({ ...config, spawns: type as SpawnType })}
                        >
                            <Stack direction="row" spacing={4}>
                                <Radio value="Looped">Looped</Radio>
                                <Radio value="Weighted">Weighted</Radio>
                                <Radio value="Consecutive">Consecutive</Radio>
                            </Stack>
                        </RadioGroup>
                    </div>
                    <div>
                        <FormLabel>Curse rooms spawn</FormLabel>
                        <RadioGroup
                            value={config.curseSpawns}
                            onChange={(type) => setConfig({ ...config, curseSpawns: type as CurseSpawnType })}
                        >
                            <Stack direction="row" spacing={4}>
                                <Radio value="Randomly">Randomly</Radio>
                                <Radio value="Always">Always</Radio>
                                <Radio value="Never">Never</Radio>
                            </Stack>
                        </RadioGroup>
                    </div>
                    <Stack spacing={1}>
                        <FormLabel>Other options</FormLabel>
                        <Checkbox
                            isChecked={optionsHasFlag(config, Options.ConfigPerFloor)}
                            onChange={(e) => setConfigOption(Options.ConfigPerFloor, e.target.checked)}
                        >
                            Configure spawns per floor
                        </Checkbox>
                        <Checkbox
                            isChecked={optionsHasFlag(config, Options.ConfigPerRoom)}
                            onChange={(e) => setConfigOption(Options.ConfigPerRoom, e.target.checked)}
                        >
                            Configure spawns per room
                        </Checkbox>
                        <Checkbox
                            isChecked={optionsHasFlag(config, Options.RemoveHealingItems)}
                            onChange={(e) => setConfigOption(Options.RemoveHealingItems, e.target.checked)}
                        >
                            Remove healing items
                        </Checkbox>
                        <Checkbox
                            isChecked={optionsHasFlag(config, Options.DisableMentorAbilities)}
                            onChange={(e) => setConfigOption(Options.DisableMentorAbilities, e.target.checked)}
                        >
                            Disable mentor abilities
                        </Checkbox>
                        <Checkbox
                            isChecked={optionsHasFlag(config, Options.DisableGiftOfIntern)}
                            onChange={(e) => setConfigOption(Options.DisableGiftOfIntern, e.target.checked)}
                        >
                            Disable gift of the intern
                        </Checkbox>
                        <Checkbox
                            isChecked={optionsHasFlag(config, Options.DisablePinned)}
                            onChange={(e) => setConfigOption(Options.DisablePinned, e.target.checked)}
                        >
                            Disable pinned skills
                        </Checkbox>
                        <Checkbox
                            isChecked={optionsHasFlag(config, Options.AwardSkillsPerLevel)}
                            onChange={(e) => setConfigOption(Options.AwardSkillsPerLevel, e.target.checked)}
                        >
                            Award starting skills per floor
                        </Checkbox>
                    </Stack>
                    <Button onClick={submitConfig}>Test sending to Tauri Core!</Button>
                    {response.length !== 0 && <div>{response}</div>}
                </Stack>
            </Stack>
        </ContentContainer>
    );
};

export default GeneralConfigTab;
