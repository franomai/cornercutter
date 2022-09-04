import { FC, useState } from 'react';
import { Button, Checkbox, FormLabel, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import Configuration, { CurseSpawnType, SpawnType, Options } from '../../types/Configuration';
import { invoke } from '@tauri-apps/api';
import { convertKeysToSnakeCase } from '../../utility/Utils';
import useConfigContext from '../../context/ConfigContext';
import { optionsHasFlag, setOptionFlag } from '../../utility/ConfigHelpers';

const GeneralConfig: FC = () => {
    const [response, setResponse] = useState<string>('');
    const [config, setConfig] = useConfigContext();

    function setConfigOption(flag: Options, isSet: boolean) {
        setConfig((config) => {
            setOptionFlag(config, flag, isSet);
            return { ...config };
        });
    }

    async function submitConfig() {
        const res = await invoke<string>('accept_config', { config: convertKeysToSnakeCase(config) });
        setResponse(res);
    }

    return (
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
    );
};

export default GeneralConfig;
