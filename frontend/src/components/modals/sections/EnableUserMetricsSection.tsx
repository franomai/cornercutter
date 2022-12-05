import TooltipCheckbox from '../../forms/TooltipCheckbox';

import { Link, Stack, Text } from '@chakra-ui/react';
import { useCallback } from 'react';
import useGoogleAnalytics from '../../../hooks/useGoogleAnalytics';
import { invoke } from '@tauri-apps/api';
import { useDispatch, useSelector } from 'react-redux';
import { getEnableUserMetrics, setEnableUserMetrics } from '../../../redux/slices/cornercutter';
import useSavingContext from '../../../contexts/SavingContext';

export default function EnableUserMetricsSection() {
    const dispatch = useDispatch();
    const GA = useGoogleAnalytics();
    const enableUserMetrics = useSelector(getEnableUserMetrics);

    const { save, setError } = useSavingContext();

    const handleChangeIsEnabled = useCallback(
        (isEnabled: boolean) => {
            invoke('set_enable_user_metrics', { enableUserMetrics })
                .then(() => {
                    const action = isEnabled ? 'Enable User Metrics' : 'Disable User Metrics';
                    GA.event({ category: 'User Metrics', action }, true);
                    dispatch(setEnableUserMetrics(isEnabled));
                })
                .catch(setError);
            save();
        },
        [GA, enableUserMetrics, save, setError, dispatch],
    );

    return (
        <>
            <Text fontSize="xl" py={4}>
                User Metrics
            </Text>
            <Stack>
                <TooltipCheckbox
                    label="Enable User Metrics"
                    tooltip="Allow us to see how you use Cornercutter."
                    isChecked={enableUserMetrics}
                    onChange={(e) => handleChangeIsEnabled(e.target.checked)}
                />
                <Text fontSize="sm">
                    Allow us to see how Cornercutter is being used. We don't collect any personal information about you.
                    Find out more{' '}
                    <Link isExternal href="https://github.com/franomai/cornercutter#user-metrics">
                        here
                    </Link>
                    .
                </Text>
            </Stack>
        </>
    );
}
