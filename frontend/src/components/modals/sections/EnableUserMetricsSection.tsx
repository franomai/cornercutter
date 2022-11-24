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
                    Allow us to see how you are using Cornercutter. None of the metrics we collect can be linked back to
                    you. You can view our privacy policy{' '}
                    <Link
                        isExternal
                        color="green.300"
                        href="https://github.com/franomai/cornercutter/blob/main/PRIVACY_POLICY.md"
                    >
                        here
                    </Link>
                    .
                </Text>
            </Stack>
        </>
    );
}
