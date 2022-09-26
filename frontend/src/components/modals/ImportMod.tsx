import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Textarea,
    useDisclosure,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import ModConfig from '../../types/Configuration';

const ImportMod = ({ handleCreate, handleDiscard }: { handleDiscard(): void; handleCreate(mod: ModConfig): void }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        onOpen();
    }, []);

    const canSave = name.trim().length !== 0;

    const handleImportMod = useCallback(() => {}, [handleCreate, name, description]);

    const handleDiscardMod = useCallback(() => {
        handleDiscard();
        onClose();
    }, [handleDiscard, onClose]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalCloseButton onClick={handleDiscardMod} />
            <ModalContent>
                <ModalHeader>Import New Mod</ModalHeader>
                <ModalBody>
                    <FormControl isRequired>
                        <FormLabel>Mod Code</FormLabel>
                        <Textarea
                            variant="flushed"
                            placeholder="Shareable mod code..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </FormControl>
                </ModalBody>
                <ModalFooter gap={2}>
                    <Button onClick={handleImportMod} isDisabled={!canSave}>
                        Import Mod
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ImportMod;
