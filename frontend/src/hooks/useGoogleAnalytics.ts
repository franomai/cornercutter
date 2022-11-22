import ReactGA from 'react-ga4';

import { useMemo } from 'react';
import { UaEventOptions } from 'react-ga4/types/ga4';
import { useSelector } from 'react-redux';
import { getGlobalOptions } from '../redux/slices/cornercutter';
import { GlobalOptions } from '../types/Configuration';
import { hasOptionSet } from '../utility/ConfigHelpers';

ReactGA.initialize(import.meta.env.VITE_MEASUREMENT_ID);

type EventHandler = (optionsOrName: string | UaEventOptions) => void;
type SendHandler = (fieldObject: string | { hitType: string; page: string }) => void;

export interface GoogleAnalytics {
    send: SendHandler;
    event: EventHandler;
}

// Used to ignore track requests when user metrics have been disabled.
// eslint-disable-next-line @typescript-eslint/no-empty-function
const EmptyFunction = () => {};

export default function useGoogleAnalytics(): GoogleAnalytics {
    const globalOptions = useSelector(getGlobalOptions);
    const enableUserMetrics = hasOptionSet(globalOptions, GlobalOptions.EnableUserMetrics);

    const event: EventHandler = useMemo(() => {
        return enableUserMetrics
            ? (optionsOrName) => {
                  try {
                      ReactGA.event(optionsOrName);
                  } catch (e) {
                      // Ignore errors - This will likely be that the user is not connected to the internet
                  }
              }
            : EmptyFunction;
    }, [enableUserMetrics]);

    const send: SendHandler = useMemo(() => {
        return enableUserMetrics
            ? (fieldObject) => {
                  try {
                      ReactGA.send(fieldObject);
                  } catch (e) {
                      // Ignore errors - This will likely be that the user is not connected to the internet
                  }
              }
            : EmptyFunction;
    }, [enableUserMetrics]);

    return { send, event };
}
