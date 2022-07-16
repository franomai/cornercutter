import { FC, useState } from 'react';
import { Box, Button, Checkbox, FormLabel, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import Configuration, { CurseSpawnType, SpawnType } from '../types/Configuration';
import { invoke } from '@tauri-apps/api';
import { convertKeysToSnakeCase } from '../utility/Utils';
import useConfigContext from '../context/ConfigContext';

const GeneralConfig: FC = () => {
    const [response, setResponse] = useState<string>('');
    const [config, setConfig] = useConfigContext();

    function set<T extends keyof Configuration>(field: T, value: Configuration[T]) {
        setConfig((config) => {
            return {
                ...config,
                [field]: value,
            };
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
                <Checkbox isChecked={config.configPerFloor} onChange={(e) => set('configPerFloor', e.target.checked)}>
                    Configure spawns per floor
                </Checkbox>
                <Checkbox isChecked={config.configPerRoom} onChange={(e) => set('configPerRoom', e.target.checked)}>
                    Configure spawns per room
                </Checkbox>
                <Checkbox
                    isChecked={config.removeHealingItems}
                    onChange={(e) => set('removeHealingItems', e.target.checked)}
                >
                    Remove healing items
                </Checkbox>
                <Checkbox
                    isChecked={config.disableMentorAbilities}
                    onChange={(e) => set('disableMentorAbilities', e.target.checked)}
                >
                    Disable mentor abilities
                </Checkbox>
                <Checkbox
                    isChecked={config.disableGiftOfIntern}
                    onChange={(e) => set('disableGiftOfIntern', e.target.checked)}
                >
                    Disable gift of the intern
                </Checkbox>
                <Checkbox isChecked={config.disablePinned} onChange={(e) => set('disablePinned', e.target.checked)}>
                    Disable pinned skills
                </Checkbox>
                <Checkbox
                    isChecked={config.awardSkillsPerLevel}
                    onChange={(e) => set('awardSkillsPerLevel', e.target.checked)}
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
