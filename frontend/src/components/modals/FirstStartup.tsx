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
import { invoke } from '@tauri-apps/api';
import { useDispatch } from 'react-redux';
import { ReactNode, useCallback, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CornercutterConfig } from '../../types/CornercutterConfig';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { setEnableUserMetrics, setIsNotFirstStartup } from '../../redux/slices/cornercutter';

const FindGoingUnder = ({ config }: { config: CornercutterConfig }) => {
    const dispatch = useDispatch();

    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        onOpen();
    }, [onOpen]);

    const handleNext = useCallback(() => {
        dispatch(setIsNotFirstStartup());

        const updatedConfig: CornercutterConfig = { ...config, isFirstStartup: false };

        invoke('save_cornercutter_config', { updatedConfig });
        onClose();
    }, [config, onClose, dispatch]);

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
                        isEnabled={config.enableUserMetrics}
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
