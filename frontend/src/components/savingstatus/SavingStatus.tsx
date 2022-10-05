import { Box, Flex, FlexProps, ScaleFade, Spinner, Text, Tooltip } from '@chakra-ui/react';
import { faCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getSavingState } from '../../redux/slices/saving';
import { getRelativeTimeSince } from '../../utility/Utils';

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

const SavingStatus = () => {
    const { status, lastSaved, error } = useSelector(getSavingState);
    const [showSpinner, setShowSpinner] = useState(false);
    const [refreshInterval, setRefreshInterval] = useState(1);

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
            <Flex {...flexProps}>
                <Text fontSize="sm" color="gray.600" textAlign="right" fontWeight="semibold" display="inline-flex">
                    Saving...
                </Text>
                <ScaleFade initialScale={0.8} in={showSpinner}>
                    <Box w={4}>
                        <Spinner size="sm" color="green.300" />
                    </Box>
                </ScaleFade>
            </Flex>
        );
    }

    return (
        <Flex {...flexProps}>
            <Text fontSize="sm" color="gray.600" textAlign="right" fontWeight="semibold" whiteSpace="nowrap">
                Last saved <b>{getRelativeTimeSince(lastSaved)}</b>
            </Text>
            <ScaleFade initialScale={0.8} in={!showSpinner}>
                <Box w={4} color={hasError ? 'red.400' : 'green.300'}>
                    {hasError ? (
                        <Tooltip hasArrow label={error.message} bg="red.400">
                            <span>
                                <FontAwesomeIcon icon={faCircleExclamation} />
                            </span>
                        </Tooltip>
                    ) : (
                        <FontAwesomeIcon icon={faCheck} />
                    )}
                </Box>
            </ScaleFade>
        </Flex>
    );
};

export default SavingStatus;
