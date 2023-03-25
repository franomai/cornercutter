import useGoogleAnalytics from '../../hooks/useGoogleAnalytics';
import ModConfig from '../../types/Configuration';

import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Textarea,
    useDisclosure,
} from '@chakra-ui/react';
import { invoke } from '@tauri-apps/api';
import { useDispatch } from 'react-redux';
import { addMod, setSelectedMod } from '../../redux/slices/mod';
import { RefObject, useCallback, useEffect, useState } from 'react';

export default function NewMod({ openRef }: { openRef: RefObject<HTMLButtonElement> }) {
    const dispatch = useDispatch();
    const GA = useGoogleAnalytics();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();

    const canSave = name.trim().length !== 0;

    useEffect(() => {
        const handler = () => onOpen();
        const current = openRef.current;
        current?.addEventListener('click', handler);

        return () => current?.removeEventListener('click', handler);
    }, [openRef, onOpen]);

    const handleClose = useCallback(() => {
        setName('');
        setDescription('');
        onClose();
    }, [onClose]);

    const handleCreateMod = useCallback(async () => {
        try {
            const newMod = await invoke<ModConfig>('create_new_mod', { modInfo: { name, description } });

            dispatch(addMod(newMod));
            dispatch(setSelectedMod(newMod.id));

            GA.event({ category: 'mods', action: 'create mod' });
        } catch (error) {
            console.error(error);
        }

        handleClose();
    }, [GA, name, description, dispatch, handleClose]);

    const handleDiscardMod = useCallback(() => {
        handleClose();
    }, [handleClose]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create New Mod</ModalHeader>
                <ModalBody>
                    <Stack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Mod Name</FormLabel>
                            <Input
                                variant="flushed"
                                placeholder="Mod Name..."
                                value={name}
                                fontSize="xl"
                                fontWeight="bold"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Textarea
                                variant="filled"
                                placeholder="Mod description..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </FormControl>
                    </Stack>
                </ModalBody>
                <ModalFooter gap={2}>
                    <Button onClick={handleDiscardMod} variant="outline">
                        Discard Mod
                    </Button>
                    <Button onClick={handleCreateMod} isDisabled={!canSave}>
                        Create Mod
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
