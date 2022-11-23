import useGoogleAnalytics from '../../hooks/useGoogleAnalytics';
import ModConfig, { DEFAULT_CONFIG } from '../../types/Configuration';

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
import { RefObject, useCallback, useEffect, useMemo, useState } from 'react';
import { invoke } from '@tauri-apps/api';
import { useDispatch } from 'react-redux';
import { addMod, setSelectedMod } from '../../redux/slices/mod';
import { generateEmptyFloorSkills } from '../../utility/ConfigHelpers';

const NewMod = ({ openRef }: { openRef: RefObject<HTMLButtonElement> }) => {
    const dispatch = useDispatch();
    const GA = useGoogleAnalytics();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newModId, setNewModId] = useState<null | string>(null);

    const canSave = useMemo(() => newModId !== null && name.trim().length !== 0, [name, newModId]);

    const handleGetNewModId = useCallback(() => {
        invoke<string>('get_new_mod_id')
            .then((id) => setNewModId(id))
            .then(onOpen)
            .catch(console.error);
    }, [onOpen, setNewModId]);

    useEffect(() => {
        const handler = () => handleGetNewModId();
        const current = openRef.current;
        current?.addEventListener('click', handler);

        return () => current?.removeEventListener('click', handler);
    }, [openRef, handleGetNewModId]);

    const handleClose = useCallback(() => {
        setName('');
        setDescription('');
        setNewModId(null);
        onClose();
    }, [onClose]);

    const handleCreateMod = useCallback(() => {
        // This is a sanity check and should never be called as the Create Mod
        // button is disabled when newModId is null.
        if (newModId === null) return;

        const newMod: ModConfig = {
            id: newModId,
            info: { name, description },
            general: DEFAULT_CONFIG,
            floorSkills: generateEmptyFloorSkills(),
        };

        dispatch(addMod(newMod));
        dispatch(setSelectedMod(newModId));

        GA.event({ category: 'mods', action: 'create mod' });

        handleClose();
    }, [GA, name, newModId, description, dispatch, handleClose]);

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
                                fontSize="3xl"
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
};

export default NewMod;
