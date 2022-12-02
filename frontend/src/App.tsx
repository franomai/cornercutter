import useGoogleAnalytics from './hooks/useGoogleAnalytics';
import ModdingConfig from './components/pages/ModdingConfig';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './redux/store';
import { loadSavedData } from './redux/slices/saving';
import { TauriEvent, listen } from '@tauri-apps/api/event';

export const startTime = Date.now();

function App() {
    const GA = useGoogleAnalytics();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(loadSavedData());
    }, [dispatch]);

    useEffect(() => {
        GA.send('pageview');
        // This prevents the event from triggering again if you refresh the page. This shouldn't be possible
        // for the built version as refreshing is only available in the dev environment.
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
