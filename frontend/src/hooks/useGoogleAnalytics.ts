import ReactGA from 'react-ga4';

import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { UaEventOptions } from 'react-ga4/types/ga4';
import { getEnableUserMetrics } from '../redux/slices/cornercutter';

// This doesn't seem to send anything about the user to Google Analytics
ReactGA.initialize(import.meta.env.VITE_MEASUREMENT_ID);

type EventHandler = (optionsOrName: string | UaEventOptions) => void;
type SendHandler = (fieldObject: string | { hitType: string; page: string }) => void;

export interface GoogleAnalytics {
    send: SendHandler;
    event: EventHandler;
}

export default function useGoogleAnalytics(): GoogleAnalytics {
    const enableUserMetrics = useSelector(getEnableUserMetrics);

    const tryCall = useCallback(
        (func: VoidFunction) => {
            if (!enableUserMetrics) {
                // User metrics have been disabled so don't send any information.
                return;
            }

            try {
                func();
            } catch (e) {
                // Ignore errors - This will likely be that the user is not connected to the internet
            }
        },
        [enableUserMetrics],
    );

    const send: SendHandler = (fieldObject) => tryCall(() => ReactGA.send(fieldObject));
    const event: EventHandler = (optionOrName) => tryCall(() => ReactGA.event(optionOrName));

    return { send, event };
}
