import { useMemo } from 'react';
import ReactGA from 'react-ga4';
import { UaEventOptions } from 'react-ga4/types/ga4';
import { useDispatch, useSelector } from 'react-redux';
import { getIsUserMetricsEnabled, setIsUserMetricsEnabled } from '../redux/slices/cornercutter';

type EventHandler = (optionsOrName: string | UaEventOptions) => void;

export interface GoogleAnalytics {
    event: EventHandler;
    toggleUserMetrics: VoidFunction;
}

// Used to ignore track requests when user metrics have been disabled.
// eslint-disable-next-line @typescript-eslint/no-empty-function
const EmptyFunction = () => {};

export default function useGoogleAnalytics(): GoogleAnalytics {
    const dispatch = useDispatch();
    const isUserMetricsEnabled = useSelector(getIsUserMetricsEnabled);

    const event: EventHandler = useMemo(() => {
        return isUserMetricsEnabled
            ? (optionsOrName) => {
                  try {
                      ReactGA.event(optionsOrName);
                  } catch (e) {
                      // Ignore errors - This will likely be that the user is not connected to the internet
                  }
              }
            : EmptyFunction;
    }, [isUserMetricsEnabled]);

    function toggleUserMetrics() {
        const newIsUserMetricsEnabled = !isUserMetricsEnabled;
        const action = newIsUserMetricsEnabled ? 'Enable User Metrics' : 'Disable User Metrics';
        // One final analytic to see how many users have disabled user metrics.
        event({ category: 'User Metrics', action });

        dispatch(setIsUserMetricsEnabled(newIsUserMetricsEnabled));
    }

    return { event, toggleUserMetrics };
}
