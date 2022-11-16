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
import { invoke } from '@tauri-apps/api/tauri';
import React, { useCallback, useEffect, useState } from 'react';
import ModConfig from '../../types/Configuration';
import ReactGA from 'react-ga4';

const ModCodeRegex = /^(#[^\r\n]*\r?\n)?(#[^\r\n]*\r?\n)?([\w\d+/]+={0,2})$/;

const ImportMod = ({
    isShown,
    handleCreate,
    handleDiscard,
}: {
    isShown: boolean;
    handleDiscard(): void;
    handleCreate(mod: ModConfig): void;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [modCode, setModCode] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isShown) {
            if (document.hasFocus()) {
                navigator.clipboard.readText().then((clipboard) => {
                    setModCode(ModCodeRegex.test(clipboard) ? clipboard : '');
                });
            } else {
                setModCode('');
            }
            setError('');
            onOpen();
        } else {
            onClose();
        }
    }, [isShown, onClose, onOpen]);

    const handleImportMod = useCallback(() => {
        invoke<ModConfig>('import_mod', { configString: modCode })
            .then((mod) => {
                ReactGA.event({ category: 'mods', action: 'import mod' });
                handleCreate(mod);
            })
            .catch((err: string) => {
                console.error(err);
                setError(err);
            });
    }, [handleCreate, modCode]);

    const handleDiscardMod = useCallback(() => {
        handleDiscard();
        onClose();
    }, [handleDiscard, onClose]);

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
        <Modal
            isOpen={isOpen}
            onClose={() => {
                handleDiscard();
                onClose();
            }}
        >
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
};

export default ImportMod;
