import SavingMessage from './SavingMessage';
import useSavingContext from '../../../../contexts/SavingContext';

import { Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getRelativeTimeSince } from '../../../../utility/Utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

export default function SavingIndicator() {
    const [refreshInterval, setRefreshInterval] = useState(1);
    const { isSaving, lastSaved, error } = useSavingContext();

    const hasError = error !== null;

    /**
     * Cause the component to remount so the last saved time updates. This needs to be done less and less
     * frequently as more time passes, hence the refresh interval is doubled each iteration.
     */
    useEffect(() => {
        const timeout = setTimeout(() => setRefreshInterval(refreshInterval * 2), refreshInterval * 1000);
        return () => clearTimeout(timeout);
    }, [refreshInterval]);

    if (lastSaved === null) return null;

    if (isSaving) {
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
            tooltip={error}
            icon={hasError ? <FontAwesomeIcon icon={faCircleExclamation} /> : <FontAwesomeIcon icon={faCheck} />}
        />
    );
}
