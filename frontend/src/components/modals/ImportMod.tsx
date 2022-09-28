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

    useEffect(() => {
        if (isShown) {
            onOpen();
        }
    }, [isShown]);

    const handleImportMod = useCallback(() => {}, [handleCreate, modCode]);

    const handleDiscardMod = useCallback(() => {
        handleDiscard();
        onClose();
    }, [handleDiscard, onClose]);

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
                    <FormControl isRequired>
                        <FormLabel>Mod Code</FormLabel>
                        <Textarea
                            variant="filled"
                            placeholder="Shareable mod code..."
                            value={modCode}
                            onChange={(e) => setModCode(e.target.value)}
                        />
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
