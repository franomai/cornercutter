import {
    Button,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
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
    const [foundDir, setFoundDir] = useState(false);

    useEffect(() => {
        if ((config.firstTime || !config.goingUnderDir) && !foundDir) {
            onOpen();
        }
    }, [config, foundDir]);

    const handleSaveGoingUnderDir = useCallback(() => {
        invoke('set_going_under_dir', { dir }).then((res) => {
            const isValid = res as boolean;
            setIsValid(isValid);
            if (isValid) {
                onClose();
                setFoundDir(true);
                dispatch(setCornercutterConfig({ ...config, goingUnderDir: dir }));
            }
        });
    }, [dir, onClose, dispatch, config]);

    if (!isOpen) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Locate Going Under for us</ModalHeader>
                <ModalBody>
                    <FormControl isInvalid={!isValid}>
                        {config?.goingUnderDir && <FormHelperText>We think we found it, is it correct?</FormHelperText>}
                        <FormLabel>Full Going Under directory</FormLabel>
                        <Input value={dir} onChange={(e) => setDir(e.target.value)} />
                        {!isValid && <FormErrorMessage>That doesn't seem to be a valid directory</FormErrorMessage>}
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => handleSaveGoingUnderDir()}>Save</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default FindGoingUnder;
