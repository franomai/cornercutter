import {
    Box,
    Flex,
    IconButton,
    Input,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Stack,
    Text,
    useOutsideClick,
} from '@chakra-ui/react';
import { faArrowUpFromBracket, faCheck, faPenToSquare, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { invoke } from '@tauri-apps/api/tauri';
import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setModInfo } from '../../../redux/slices/mod';
import ModConfig from '../../../types/Configuration';

const ModInformation = ({ selectedMod }: { selectedMod: ModConfig }) => {
    const dispatch = useDispatch();
    const editableRef = useRef<HTMLDivElement>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(selectedMod.info.name);
    const [newDescription, setNewDescription] = useState(selectedMod.info.description);
    const [configCode, setConfigCode] = useState<string | null>(null);
    const [showConfigCodePopup, setShowConfigCodePopup] = useState(false);

    useEffect(() => {
        if (showConfigCodePopup) {
            const timeout = setTimeout(() => setShowConfigCodePopup(false), 500);
            return () => clearTimeout(timeout);
        }
    }, [showConfigCodePopup]);

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

    const handleExportConfigCode = useCallback(async () => {
        try {
            const code = await invoke<string>('get_config_code', { modConfig: selectedMod });
            setConfigCode(code);
            navigator.clipboard.writeText(code).then(() => setShowConfigCodePopup(true));
        } catch (err) {
            console.error(err);
        }
    }, []);

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
                            <Popover isOpen={showConfigCodePopup} placement="top">
                                <PopoverTrigger>
                                    <IconButton
                                        variant="ghost"
                                        title="Export mod config code"
                                        aria-label="Export mod config code"
                                        icon={<FontAwesomeIcon icon={faArrowUpFromBracket} size="lg" />}
                                        onClick={handleExportConfigCode}
                                    />
                                </PopoverTrigger>
                                <PopoverContent w="min" whiteSpace="nowrap">
                                    <PopoverArrow />
                                    <PopoverBody>Shareable code copied to clipboard</PopoverBody>
                                </PopoverContent>
                            </Popover>

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
        [isEditing, showConfigCodePopup, handleSaveChanges, handleDiscardChanges],
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
