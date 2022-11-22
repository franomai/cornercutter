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
import { useCallback, useEffect, useState } from 'react';
import ModConfig, { DEFAULT_CONFIG } from '../../types/Configuration';
import { generateEmptyFloorSkills } from '../../utility/ConfigHelpers';
import useGoogleAnalytics from '../../hooks/useGoogleAnalytics';

const NewMod = ({
    id,
    handleCreate,
    handleDiscard,
}: {
    id: string;
    handleDiscard(): void;
    handleCreate(mod: ModConfig): void;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const GA = useGoogleAnalytics();

    useEffect(() => {
        onOpen();
    }, [id, onOpen]);

    const canSave = name.trim().length !== 0;

    const handleCreateMod = useCallback(() => {
        handleCreate({
            id,
            info: { name, description },
            general: DEFAULT_CONFIG,
            floorSkills: generateEmptyFloorSkills(),
        });
        GA.event({ category: 'mods', action: 'create mod' });
    }, [id, handleCreate, name, description, GA]);

    const handleDiscardMod = useCallback(() => {
        handleDiscard();
        onClose();
    }, [handleDiscard, onClose]);

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
