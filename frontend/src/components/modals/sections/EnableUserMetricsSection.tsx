import TooltipCheckbox from '../../forms/TooltipCheckbox';

import { Link, Stack, Text } from '@chakra-ui/react';

export interface EnableUserMetricsSectionProps {
    isEnabled: boolean;
    setIsEnabled(isEnabled: boolean): void;
}

export default function EnableUserMetricsSection({ isEnabled, setIsEnabled }: EnableUserMetricsSectionProps) {
    return (
        <>
            <Text fontSize="xl" py={4}>
                User Metrics
            </Text>
            <Stack>
                <TooltipCheckbox
                    label="Enable User Metrics"
                    tooltip="Allow us to see how you use Cornercutter."
                    isChecked={isEnabled}
                    onChange={(e) => setIsEnabled(e.target.checked)}
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
