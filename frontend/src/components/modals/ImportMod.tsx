import ModConfig from '../../types/Configuration';
import useGoogleAnalytics from '../../hooks/useGoogleAnalytics';

import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Textarea,
    useDisclosure,
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { invoke } from '@tauri-apps/api/tauri';
import { addMod, setSelectedMod } from '../../redux/slices/mod';
import { RefObject, useCallback, useEffect, useState } from 'react';

const ModCodeRegex = /^(#[^\r\n]*\r?\n)?(#[^\r\n]*\r?\n)?([\w\d+/]+={0,2})$/;

export default function ImportMod({ openRef }: { openRef: RefObject<HTMLButtonElement> }) {
    const dispatch = useDispatch();
    const GA = useGoogleAnalytics();

    const [error, setError] = useState('');
    const [modCode, setModCode] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        const handler = () => onOpen();
        const current = openRef.current;
        current?.addEventListener('click', handler);

        return () => current?.removeEventListener('click', handler);
    }, [openRef, onOpen]);

    useEffect(() => {
        if (isOpen && document.hasFocus()) {
            navigator.clipboard.readText().then((clipboard) => {
                setModCode(ModCodeRegex.test(clipboard) ? clipboard : '');
            });
        }
    }, [isOpen]);

    const handleClose = useCallback(() => {
        setError('');
        setModCode('');
        onClose();
    }, [onClose]);

    const handleImportMod = useCallback(() => {
        invoke<ModConfig>('import_mod', { configString: modCode })
            .then((mod) => {
                dispatch(addMod(mod));
                dispatch(setSelectedMod(mod.id));
                GA.event({ category: 'mods', action: 'import mod' });

                handleClose();
            })
            .catch(setError);
    }, [GA, modCode, dispatch, handleClose]);

    const handleDiscardMod = useCallback(() => {
        handleClose();
    }, [handleClose]);

    const handleChangeModCode = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            if (error.length !== 0) {
                setError('');
            }
            setModCode(e.target.value);
        },
        [error],
    );

    return (
        <Modal isOpen={isOpen} onClose={handleDiscardMod}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Import New Mod</ModalHeader>
                <ModalCloseButton onClick={handleDiscardMod} />
                <ModalBody>
                    <FormControl isRequired isInvalid={error.length !== 0}>
                        <FormLabel>Mod Code</FormLabel>
                        <Textarea
                            variant="filled"
                            placeholder={`# Mod Name\n# Mod description...\nAAEAACYBAgRWL1IbAAEeARABXwJCNg==`}
                            value={modCode}
                            onChange={handleChangeModCode}
                            height="90px"
                        />
                        <FormErrorMessage>{error}</FormErrorMessage>
                    </FormControl>
                </ModalBody>
                <ModalFooter gap={2}>
                    <Button onClick={handleImportMod} isDisabled={modCode.length === 0}>
                        Import Mod
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
