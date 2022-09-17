import { Box, Flex, IconButton, Input, Stack, Text, useOutsideClick } from '@chakra-ui/react';
import { faArrowUpFromBracket, faCheck, faPenToSquare, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ReactNode, useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setModInfo } from '../../../redux/slices/mod';
import ModConfig from '../../../types/Configuration';

const ModInformation = ({ selectedMod }: { selectedMod: ModConfig }) => {
    const dispatch = useDispatch();
    const editableRef = useRef<HTMLDivElement>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(selectedMod.info.name);
    const [newDescription, setNewDescription] = useState(selectedMod.info.description);

    const handleSaveChanges = useCallback(() => {
        if (newName !== selectedMod.info.name || newDescription !== selectedMod.info.description) {
            dispatch(setModInfo({ name: newName, description: newDescription }));
        }
        setIsEditing(false);
    }, [dispatch, newName, newDescription, selectedMod.info]);

    useOutsideClick({
        ref: editableRef,
        enabled: isEditing,
        handler: handleSaveChanges,
    });

    const handleKeyPress = useCallback(
        (e: React.KeyboardEvent) => {
            if (isEditing && e.key === 'Enter') {
                handleSaveChanges();
            }
        },
        [isEditing, handleSaveChanges],
    );

    const handleDiscardChanges = useCallback(() => {
        setNewName(selectedMod.info.name);
        setNewDescription(selectedMod.info.description);
        setIsEditing(false);
    }, [selectedMod.info]);

    const renderEditableControls = useCallback(
        (canSave: boolean): ReactNode => {
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
        },
        [isEditing, handleSaveChanges, handleDiscardChanges],
    );

    const renderName = useCallback((): ReactNode => {
        return isEditing ? (
            <Input
                fontSize="3xl"
                fontWeight="bold"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                mr={4}
                ml="-17px"
                mt="-3px"
                height="50px"
            />
        ) : (
            <Text fontSize="3xl" fontWeight="bold">
                {newName}
            </Text>
        );
    }, [newName, isEditing]);

    const renderDescription = useCallback((): ReactNode => {
        return isEditing ? (
            <Input
                ml="-17px"
                mt={-2}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                mb={-2}
            />
        ) : (
            <Text mt="3px">{newDescription}</Text>
        );
    }, [newDescription, isEditing]);

    return (
        <Stack spacing={3} ref={editableRef} onKeyDown={handleKeyPress}>
            <Flex direction="row" justifyContent="space-between" alignItems="center">
                {renderName()}
                {renderEditableControls(newName.trim().length !== 0 && newDescription.trim().length !== 0)}
            </Flex>
            <Box>{renderDescription()}</Box>
        </Stack>
    );
};

export default ModInformation;
