import SavingMessage from './SavingMessage';
import useSavingContext from '../../../../contexts/SavingContext';

import { Spinner, Tooltip } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getRelativeTimeSince } from '../../../../utility/Utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

export default function SavingIndicator() {
    const [isSaving, setIsSaving] = useState(false);
    const [refreshInterval, setRefreshInterval] = useState(1);
    const { lastSaved, error } = useSavingContext();

    const hasError = error !== null;

    // In reality, the time it takes to send the updated config to the backend to be persisted
    // is extremely fast. This means if we were to only show the spinner for this period it would just
    // flash for an instant. Instead, what we're doing is artificially causing the spinner to show for
    // a fixed period of time to give the users the illusion that it's "actually" being saved.
    useEffect(() => {
        if (lastSaved) {
            setIsSaving(true);
            const timeout = setTimeout(() => setIsSaving(false), 350);
            return () => clearTimeout(timeout);
        }
    }, [lastSaved]);

    // Cause the component to remount so the last saved time updates. This needs to be done less and less
    // frequently as more time passes, hence the refresh interval is doubled each iteration.
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
                    Last saved{' '}
                    <Tooltip
                        hasArrow
                        label={new Date(lastSaved).toLocaleTimeString(undefined, {
                            hour: 'numeric',
                            minute: 'numeric',
                        })}
                    >
                        <b style={{ borderBottom: '2px dotted' }}>{getRelativeTimeSince(lastSaved)}</b>
                    </Tooltip>
                </span>
            }
            tooltip={error}
            icon={hasError ? <FontAwesomeIcon icon={faCircleExclamation} /> : <FontAwesomeIcon icon={faCheck} />}
        />
    );
}
