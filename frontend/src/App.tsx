import { useEffect, useState } from 'react';
import './App.css';
import { Button, Checkbox, Container, Stack } from '@chakra-ui/react';
import Configuration from './types/Configuration';
import { invoke } from '@tauri-apps/api';
import { convertKeysToSnakeCase } from './utility/Utils';

const EMPTY_CONFIG: Configuration = {
    disableHp: false,
    disableOtherDrops: false,
};

function App() {
    const [response, setResponse] = useState<string>('');
    const [config, setConfig] = useState<Configuration>(EMPTY_CONFIG);

    useEffect(() => {
        console.log(config);
    }, [config]);

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
            <Container>
                <Stack spacing={5} my={4}>
                    <Checkbox isChecked={config.disableHp} onChange={(e) => updateConfig('disableHp', e)}>
                        Disable HP
                    </Checkbox>
                    <Checkbox
                        isChecked={config.disableOtherDrops}
                        onChange={(e) => updateConfig('disableOtherDrops', e)}
                    >
                        Disable other drops
                    </Checkbox>
                    <Button onClick={submitConfig}>Test sending to Tauri Core!</Button>
                    {response.length !== 0 && <div>{response}</div>}
                </Stack>
            </Container>
        </div>
    );
}

export default App;
