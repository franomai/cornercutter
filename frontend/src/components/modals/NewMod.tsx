import {
    Button,
    Center,
    Flex,
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
import ContentContainer from '../layout/ContentContainer';

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

    useEffect(() => {
        onOpen();
    }, [id]);

    const canSave = name.trim().length !== 0;

    const handleCreateMod = useCallback(() => {
        handleCreate({
            id,
            info: { name, description },
            general: DEFAULT_CONFIG,
            floorSkills: generateEmptyFloorSkills(),
        });
    }, [id, handleCreate, name, description]);

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
                                variant="flushed"
                                placeholder="Mod description..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </FormControl>
                    </Stack>
                    <ModalFooter gap={2}>
                        <Button onClick={handleDiscardMod} variant="outline">
                            Discard Mod
                        </Button>
                        <Button onClick={handleCreateMod} isDisabled={!canSave}>
                            Create Mod
                        </Button>
                    </ModalFooter>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default NewMod;
