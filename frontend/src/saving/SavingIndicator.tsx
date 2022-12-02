import SavingMessage from './SavingMessage';

import { useSelector } from 'react-redux';
import { Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getRelativeTimeSince } from '../utility/Utils';
import { getSavingState } from '../redux/slices/saving';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

export default function SavingIndicator() {
    const [showSpinner, setShowSpinner] = useState(false);
    const [refreshInterval, setRefreshInterval] = useState(1);
    const { status, lastSaved, error } = useSelector(getSavingState);

    const hasError = error !== null;

    useEffect(() => {
        if (status === 'pending') {
            setShowSpinner(true);
        } else {
            const timeout = setTimeout(() => setShowSpinner(false), 350);
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
                <span>
                    Last saved <b>{getRelativeTimeSince(lastSaved)}</b>
                </span>
            }
            tooltip={error?.message}
            icon={hasError ? <FontAwesomeIcon icon={faCircleExclamation} /> : <FontAwesomeIcon icon={faCheck} />}
        />
    );
}
