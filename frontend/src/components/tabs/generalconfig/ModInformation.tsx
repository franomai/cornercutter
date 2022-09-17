import {
    Editable,
    EditableInput,
    EditablePreview,
    Flex,
    IconButton,
    Stack,
    Text,
    useEditableControls,
} from '@chakra-ui/react';
import { faArrowUpFromBracket, faCheck, faPenToSquare, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useState } from 'react';
import ModConfig from '../../../types/Configuration';

const ModInformation = ({ selectedMod }: { selectedMod: ModConfig }) => {
    const [newName, setNewName] = useState(selectedMod.info.name);
    const [newDescription, setNewDescription] = useState(selectedMod.info.description);

    function EditableControls({ canSave }: { canSave: boolean }) {
        const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls();

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
                                {...getSubmitButtonProps()}
                            />
                        )}
                        <IconButton
                            variant="ghost"
                            title="Discard changes"
                            aria-label="Discard changes"
                            icon={<FontAwesomeIcon icon={faXmark} size="lg" />}
                            {...getCancelButtonProps()}
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
                            {...getEditButtonProps()}
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
        <Stack spacing={2}>
            <Editable defaultValue={newName} onChange={setNewName}>
                <Flex
                    direction="row"
                    justifyContent="space-between"
                    fontSize="3xl"
                    fontWeight="bold"
                    alignItems="center"
                >
                    <EditablePreview />
                    <EditableInput ml={-2} pl={2} mr={4} />
                    <EditableControls canSave={newName.trim().length !== 0 && newDescription.trim().length !== 0} />
                </Flex>
            </Editable>
            <Text>{selectedMod.info.description}</Text>
        </Stack>
    );
};

export default ModInformation;
