import ModdingConfig from './components/pages/ModdingConfig';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './redux/store';
import { TauriEvent, listen } from '@tauri-apps/api/event';
import { loadSavedData } from './redux/slices/saving';

import './App.css';
import useGoogleAnalytics from './hooks/useGoogleAnalytics';

export const startTime = Date.now();

function App() {
    const dispatch = useDispatch<AppDispatch>();
    const GA = useGoogleAnalytics();

    useEffect(() => {
        dispatch(loadSavedData());
    }, [dispatch]);

    useEffect(() => {
        GA.send('pageview');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const promise = listen(TauriEvent.WINDOW_CLOSE_REQUESTED, () => {
            const runningTime = Date.now() - startTime;
            GA.event({ category: 'Application', action: 'Close Cornercutter', value: runningTime });
        });

        return () => {
            promise.then((unlisten) => unlisten());
        };
    }, [GA]);

    return <ModdingConfig />;
}

export default App;
