import { FC, useState } from 'react';
import { Box, Button, Checkbox, Container, FormLabel, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import Configuration from '../types/Configuration';
import { invoke } from '@tauri-apps/api';
import { convertKeysToSnakeCase } from '../utility/Utils';
import useConfigContext from '../context/ConfigContext';

const GeneralConfig: FC = () => {
    const [response, setResponse] = useState<string>('');
    const [config, setConfig] = useConfigContext();

    function updateConfig(field: keyof Configuration, e: React.ChangeEvent<HTMLInputElement>) {
        setConfig((config) => {
            const updatedConfig = { ...config };
            updatedConfig[field] = e.target.checked;
            return updatedConfig;
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
                <RadioGroup defaultValue="1">
                    <Stack direction="row" spacing={4}>
                        <Radio value="1">Looped</Radio>
                        <Radio value="2">Weighted</Radio>
                    </Stack>
                </RadioGroup>
            </div>
            <div>
                <FormLabel>Curse rooms spawn</FormLabel>
                <RadioGroup defaultValue="1">
                    <Stack direction="row" spacing={4}>
                        <Radio value="1">Randomly</Radio>
                        <Radio value="2">Always</Radio>
                        <Radio value="3">Never</Radio>
                    </Stack>
                </RadioGroup>
            </div>
            <Stack spacing={1}>
                <FormLabel>Other options</FormLabel>
                <Checkbox>Configure spawns per floor</Checkbox>
                <Checkbox>Configure spawns per room</Checkbox>
                <Checkbox isChecked={config.disableHp} onChange={(e) => updateConfig('disableHp', e)}>
                    Disable HP
                </Checkbox>
                <Checkbox isChecked={config.disableOtherDrops} onChange={(e) => updateConfig('disableOtherDrops', e)}>
                    Disable other drops
                </Checkbox>
                <Checkbox>Blank on empty</Checkbox>
                <Checkbox>Disable pinned abilities</Checkbox>
                <Checkbox>Award weapons at level start</Checkbox>
            </Stack>
            <Button onClick={submitConfig}>Test sending to Tauri Core!</Button>
            {response.length !== 0 && <div>{response}</div>}
        </Stack>
    );
};

export default GeneralConfig;
