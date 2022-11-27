import EnableUserMetricsSection from './sections/EnableUserMetricsSection';

import {
    Button,
    Flex,
    Link,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { ReactNode, useCallback, useEffect } from 'react';
import { CornerCutterConfig } from '../../types/CornerCutterConfig';
import { getEnableUserMetrics, setEnableUserMetrics, setIsNotFirstStartup } from '../../redux/slices/cornercutter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

const FindGoingUnder = ({ config }: { config: CornerCutterConfig }) => {
    const dispatch = useDispatch();
    const enableUserMetrics = useSelector(getEnableUserMetrics);

    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        onOpen();
    }, [onOpen]);

    const handleNext = useCallback(() => {
        dispatch(setIsNotFirstStartup());
        onClose();
    }, [onClose, dispatch]);

    const renderCornercutterDescription = useCallback((): ReactNode => {
        return (
            <Stack gap={1}>
                {config.isSetupSuccessful ? (
                    <Text>
                        Cornercutter is a modding tool for Going Under that enables complete customisation of how skills
                        spawn.
                    </Text>
                ) : (
                    <>
                        <Flex alignItems="center" gap={1} color="red.300">
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                            <Text fontWeight="semibold">We couldn't install the Cornercutter mod.</Text>
                        </Flex>
                        <Text>
                            This is likely due to Going Under being installed in a location where we don't have
                            permission to create new files. Please report this to us{' '}
                            <Link
                                isExternal
                                color="green.300"
                                href="https://github.com/franomai/cornercutter/issues/new"
                            >
                                here
                            </Link>
                            .
                        </Text>
                    </>
                )}
            </Stack>
        );
    }, [config.isSetupSuccessful]);

    return (
        <Modal isOpen={isOpen} onClose={handleNext} closeOnOverlayClick={config.isSetupSuccessful}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Welcome to Cornercutter</ModalHeader>
                <ModalBody>
                    {renderCornercutterDescription()}
                    <EnableUserMetricsSection
                        isEnabled={enableUserMetrics}
                        setIsEnabled={(isEnabled) => dispatch(setEnableUserMetrics(isEnabled))}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant="primary" onClick={handleNext} disabled={!config.isSetupSuccessful}>
                        Next
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default FindGoingUnder;
