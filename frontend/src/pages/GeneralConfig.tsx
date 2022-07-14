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
                <Checkbox isChecked={config.disableHp} onChange={(e) => set('disableHp', e.target.checked)}>
                    Disable HP
                </Checkbox>
                <Checkbox
                    isChecked={config.disableOtherDrops}
                    onChange={(e) => set('disableOtherDrops', e.target.checked)}
                >
                    Disable other drops
                </Checkbox>
                <Checkbox isChecked={config.blankOnEmpty} onChange={(e) => set('blankOnEmpty', e.target.checked)}>
                    Blank on empty
                </Checkbox>
                <Checkbox isChecked={config.disablePinned} onChange={(e) => set('disablePinned', e.target.checked)}>
                    Disable pinned abilities
                </Checkbox>
                <Checkbox isChecked={config.awardPerLevel} onChange={(e) => set('awardPerLevel', e.target.checked)}>
                    Award weapons at level start
                </Checkbox>
            </Stack>
            <Button onClick={submitConfig}>Test sending to Tauri Core!</Button>
            {response.length !== 0 && <div>{response}</div>}
        </Stack>
    );
};

export default GeneralConfig;
