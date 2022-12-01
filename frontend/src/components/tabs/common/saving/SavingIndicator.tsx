import { Box, Flex, FlexProps, ScaleFade, Spinner, Text, Tooltip } from '@chakra-ui/react';
import { faCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getSavingState } from '../../../../redux/slices/saving';
import { getRelativeTimeSince } from '../../../../utility/Utils';
import SavingMessage from './SavingMessage';

const flexProps: FlexProps = {
    h: 'full',
    w: 'full',
    bg: 'blackAlpha.200',
    borderBottomWidth: 2,
    justifyContent: 'end',
    alignItems: 'center',
    flexDirection: 'row',
    pr: 4,
    gap: 2,
};

export default function SavingIndicator() {
    const [showSpinner, setShowSpinner] = useState(false);
    const [refreshInterval, setRefreshInterval] = useState(1);
    const { status, lastSaved, error } = useSelector(getSavingState);

    const hasError = error !== null;

    useEffect(() => {
        if (status === 'pending') {
            setShowSpinner(true);
        } else {
            const timeout = setTimeout(() => setShowSpinner(false), 2000);
            setRefreshInterval(1);
            return () => clearTimeout(timeout);
        }
    }, [status]);

    /**
     * Cause the component to remount so the last saved time updates. This needs to be done less and less
     * frequently as more time passes, hence the refresh interval is doubled each iteration.
     */
    useEffect(() => {
        const timeout = setTimeout(() => setRefreshInterval(refreshInterval * 2), refreshInterval * 1000);
        return () => clearTimeout(timeout);
    }, [refreshInterval]);

    if (lastSaved === null) return null;

    if (showSpinner) {
        return (
            <SavingMessage
                message="Saving..."
                tooltip="Saving changes"
                icon={<Spinner size="sm" color="green.300" />}
            />
        );
    }

    return (
        <SavingMessage
            hasError={hasError}
            message={
                <Box>
                    Last saved <b>{getRelativeTimeSince(lastSaved)}</b>
                </Box>
            }
            tooltip={error?.message}
            icon={hasError ? <FontAwesomeIcon icon={faCircleExclamation} /> : <FontAwesomeIcon icon={faCheck} />}
        />
    );
}
