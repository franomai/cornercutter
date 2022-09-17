import {
    Box,
    Editable,
    EditableInput,
    EditablePreview,
    Flex,
    IconButton,
    Input,
    Stack,
    Text,
    useEditable,
    useEditableControls,
} from '@chakra-ui/react';
import { faArrowUpFromBracket, faCheck, faPenToSquare, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setModInfo } from '../../../redux/slices/mod';
import ModConfig from '../../../types/Configuration';

const ModInformation = ({ selectedMod }: { selectedMod: ModConfig }) => {
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(selectedMod.info.name);
    const [newDescription, setNewDescription] = useState(selectedMod.info.description);

    function handleSaveChanges() {
        setIsEditing(false);
        dispatch(setModInfo({ name: newName, description: newDescription }));
    }

    function handleDiscardChanges() {
        setNewName(selectedMod.info.name);
        setNewDescription(selectedMod.info.description);
        setIsEditing(false);
    }

    function EditableControls({ canSave }: { canSave: boolean }) {
        return (
            <Stack direction="row" spacing={1.5}>
                {isEditing ? (
                    <>
                        {canSave && (
                            <IconButton
                                variant="ghost"
                                title="Save changes"
                                aria-label="Save changes"
                                icon={<FontAwesomeIcon icon={faCheck} size="lg" />}
                                onClick={handleSaveChanges}
                            />
                        )}
                        <IconButton
                            variant="ghost"
                            title="Discard changes"
                            aria-label="Discard changes"
                            icon={<FontAwesomeIcon icon={faXmark} size="lg" />}
                            onClick={handleDiscardChanges}
                        />
                    </>
                ) : (
                    <>
                        <IconButton
                            variant="ghost"
                            title="Export mod config code"
                            aria-label="Export mod config code"
                            icon={<FontAwesomeIcon icon={faArrowUpFromBracket} size="lg" />}
                        />
                        <IconButton
                            variant="ghost"
                            title="Edit mod config name and description"
                            aria-label="Edit mod config name and description"
                            icon={<FontAwesomeIcon icon={faPenToSquare} size="lg" />}
                            onClick={() => setIsEditing(true)}
                        />
                        <IconButton
                            variant="ghost"
                            title="Delete mod"
                            aria-label="Delete mod"
                            icon={<FontAwesomeIcon icon={faTrash} size="lg" />}
                        />
                    </>
                )}
            </Stack>
        );
    }

    return (
        <Stack spacing={3}>
            <Flex direction="row" justifyContent="space-between" alignItems="center">
                {isEditing ? (
                    <Input
                        fontSize="3xl"
                        fontWeight="bold"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        pl={2}
                        mr={4}
                        ml="-9px"
                        mt="-3px"
                        height="50px"
                    />
                ) : (
                    <Text fontSize="3xl" fontWeight="bold">
                        {newName}
                    </Text>
                )}
                <EditableControls canSave={newName.trim().length !== 0 && newDescription.trim().length !== 0} />
            </Flex>
            <Box>
                {isEditing ? (
                    <Input
                        ml="-9px"
                        mt={-2}
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        pl={2}
                        mb={-2}
                    />
                ) : (
                    <Text mt="3px">{newDescription}</Text>
                )}
            </Box>
        </Stack>
    );
};

export default ModInformation;
