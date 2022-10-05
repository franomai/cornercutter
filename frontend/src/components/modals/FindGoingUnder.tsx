import {
    Button,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input,
    Link,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { invoke } from '@tauri-apps/api/tauri';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCornercutterConfig } from '../../redux/slices/cornercutter';
import { CornerCutterConfig } from '../../types/CornerCutterConfig';

const FindGoingUnder = ({ config }: { config: CornerCutterConfig }) => {
    const dispatch = useDispatch();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [dir, setDir] = useState(config.goingUnderDir ?? '');
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
        if (!config.setDirectory) {
            onOpen();
        }
    }, [config.setDirectory]);

    const handleSaveGoingUnderDir = useCallback(() => {
        let strippedDir = dir.replace(/\\Going Under.exe$/, '');
        invoke<boolean>('set_going_under_dir', { dir: strippedDir }).then((isValid) => {
            setIsValid(isValid);
            if (isValid) {
                onClose();
                dispatch(setCornercutterConfig({ setDirectory: true, goingUnderDir: dir }));
            }
        });
    }, [dir, onClose, dispatch, config]);

    if (!isOpen) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Locate Going Under For Us</ModalHeader>
                <ModalBody>
                    <FormControl isInvalid={!isValid}>
                        {config?.goingUnderDir && <FormHelperText>We think we found it, is it correct?</FormHelperText>}
                        <FormLabel>Full Going Under directory</FormLabel>
                        <Input value={dir} onChange={(e) => setDir(e.target.value)} />
                        {!isValid && <FormErrorMessage>That doesn't seem to be a valid directory</FormErrorMessage>}
                    </FormControl>
                    <Text mt={2}>
                        Not sure where Going Under is installed? Check out{' '}
                        <Link
                            isExternal
                            color="green.300"
                            href="https://github.com/franomai/cornercutter#finding-your-going-under-installation"
                        >
                            this tutorial
                        </Link>
                        .
                    </Text>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => handleSaveGoingUnderDir()}>Save</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default FindGoingUnder;
