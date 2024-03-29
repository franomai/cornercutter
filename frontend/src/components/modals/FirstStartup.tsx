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
import { setIsNotFirstStartup } from '../../redux/slices/cornercutter';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

export default function FirstStartup({ config }: { config: CornercutterConfig }) {
    const dispatch = useDispatch();

    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        if (config.isFirstStartup) {
            onOpen();
        }
    }, [config.isFirstStartup, onOpen]);

    const handleNext = useCallback(() => {
        Promise.all([
            invoke('set_is_not_first_startup'),
            invoke('set_enable_user_metrics', { enableUserMetrics: config.enableUserMetrics }),
        ]).then(() => dispatch(setIsNotFirstStartup()));
        onClose();
    }, [config.enableUserMetrics, onClose, dispatch]);

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
                            <Link isExternal href="https://github.com/franomai/cornercutter/issues/new">
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
                    <EnableUserMetricsSection />
                </ModalBody>
                <ModalFooter>
                    <Button variant="primary" onClick={handleNext} disabled={!config.isSetupSuccessful}>
                        Next
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
