import ModdingConfig from './components/pages/ModdingConfig';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { getCornercutterConfig, setCornercutterConfig } from './redux/slices/cornercutter';
import { useEffect } from 'react';
import { invoke } from '@tauri-apps/api';
import { CornerCutterConfig } from './types/CornerCutterConfig';

function App() {
    const dispatch = useDispatch();
    const cornercutterConfig = useSelector(getCornercutterConfig);

    useEffect(() => {
        if (cornercutterConfig === null) {
            invoke('get_cornercutter_config')
                .then((config) => dispatch(setCornercutterConfig(config as CornerCutterConfig)))
                .catch(console.error);
        }
    }, [cornercutterConfig]);

    return <ModdingConfig />;
}

export default App;
