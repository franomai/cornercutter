import { FC, useState } from 'react';
import { Button, Checkbox, Container, FormLabel, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import Configuration from '../types/Configuration';
import { invoke } from '@tauri-apps/api';
import { convertKeysToSnakeCase } from '../utility/Utils';

const EMPTY_CONFIG: Configuration = {
    disableHp: false,
    disableOtherDrops: false,
};

const GeneralConfig: FC = () => {
    const [response, setResponse] = useState<string>('');
    const [config, setConfig] = useState<Configuration>(EMPTY_CONFIG);

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
        <div className="App">
            <Container my={4}>
                <Stack spacing={4}>
                    <div>
                        <FormLabel>Spawns</FormLabel>
                        <RadioGroup defaultValue="1">
                            <Stack direction="row" spacing={4}>
                                <Radio value="1">Looped</Radio>
                                <Radio value="2">Weighted</Radio>
                            </Stack>
                        </RadioGroup>
                    </div>
                    <div>
                        <FormLabel>Curse spawns</FormLabel>
                        <RadioGroup defaultValue="1">
                            <Stack direction="row" spacing={4}>
                                <Radio value="1">Random</Radio>
                                <Radio value="2">Always</Radio>
                                <Radio value="3">Never</Radio>
                            </Stack>
                        </RadioGroup>
                    </div>
                    <div>
                        <FormLabel>Configure per</FormLabel>
                        <Stack direction="row" spacing={4}>
                            <Checkbox>Floor</Checkbox>
                            <Checkbox>Room</Checkbox>
                        </Stack>
                    </div>
                    <Stack spacing={1}>
                        <FormLabel>Other options</FormLabel>
                        <Checkbox isChecked={config.disableHp} onChange={(e) => updateConfig('disableHp', e)}>
                            Disable HP
                        </Checkbox>
                        <Checkbox
                            isChecked={config.disableOtherDrops}
                            onChange={(e) => updateConfig('disableOtherDrops', e)}
                        >
                            Disable other drops
                        </Checkbox>
                        <Checkbox>Blank on empty</Checkbox>
                        <Checkbox>Disable pinned</Checkbox>
                        <Checkbox>Award per level</Checkbox>
                    </Stack>
                    <Button onClick={submitConfig}>Test sending to Tauri Core!</Button>
                    {response.length !== 0 && <div>{response}</div>}
                </Stack>
            </Container>
        </div>
    );
};

export default GeneralConfig;
