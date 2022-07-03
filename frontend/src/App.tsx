import { useEffect, useState } from 'react';
import './App.css';
import { Button, Checkbox, Container, Stack } from '@chakra-ui/react';
import Configuration from './types/Configuration';
import { invoke } from '@tauri-apps/api';

function App() {
    const [response, setResponse] = useState<string>('');
    const [config, setConfig] = useState<Configuration>({});

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
        setConfig({});
        const res = await invoke<string>('submitConfig', { config: config });
        setResponse(res);
    }

    return (
        <div className="App">
            <Container>
                <Stack spacing={5} my={4}>
                    <Checkbox isChecked={config.disableHp === true} onChange={(e) => updateConfig('disableHp', e)}>
                        Disable HP
                    </Checkbox>
                    <Checkbox
                        isChecked={config.disableOtherDrops === true}
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
