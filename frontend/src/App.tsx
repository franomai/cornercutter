import ReactGA from 'react-ga4';
import ModdingConfig from './components/pages/ModdingConfig';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './redux/store';
import { TauriEvent, listen } from '@tauri-apps/api/event';
import { loadSavedData } from './redux/slices/saving';

import './App.css';

export const startTime = Date.now();

listen(TauriEvent.WINDOW_CLOSE_REQUESTED, () => {
    const runningTime = Date.now() - startTime;
    ReactGA.event({ category: 'Application', action: 'Close Cornercutter', value: runningTime });
});

function App() {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(loadSavedData());
    }, [dispatch]);

    return <ModdingConfig />;
}

export default App;
