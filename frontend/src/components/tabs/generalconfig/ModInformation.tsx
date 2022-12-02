import ModConfig from '../../../types/Configuration';
import useGoogleAnalytics from '../../../hooks/useGoogleAnalytics';

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
import { useDispatch } from 'react-redux';
import { invoke } from '@tauri-apps/api/tauri';
import { AppDispatch } from '../../../redux/store';
import { saveSelectedMod } from '../../../redux/slices/saving';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { deleteMod, setModInfo } from '../../../redux/slices/mod';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { faArrowUpFromBracket, faCheck, faPenToSquare, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';

export default function ModInformation({ selectedMod }: { selectedMod: ModConfig }) {
    const GA = useGoogleAnalytics();
    const dispatch = useDispatch<AppDispatch>();
    const editableRef = useRef<HTMLDivElement>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(selectedMod.info.name);
    const [newDescription, setNewDescription] = useState(selectedMod.info.description);
    const [showConfigCodePopup, setShowConfigCodePopup] = useState(false);

    useEffect(() => {
        if (showConfigCodePopup) {
            const timeout = setTimeout(() => setShowConfigCodePopup(false), 500);
            return () => clearTimeout(timeout);
        }
    }, [showConfigCodePopup]);

    useEffect(() => {
        setNewName(selectedMod.info.name);
        setNewDescription(selectedMod.info.description);
    }, [selectedMod]);

    const handleSaveChanges = useCallback(() => {
        if (newName !== selectedMod.info.name || newDescription !== selectedMod.info.description) {
            dispatch(setModInfo({ name: newName, description: newDescription }));
            dispatch(saveSelectedMod());
        }
        setIsEditing(false);
    }, [newName, newDescription, selectedMod.info, dispatch]);

    useOutsideClick({
        ref: editableRef,
        enabled: isEditing && newName.trim().length !== 0,
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
            navigator.clipboard.writeText(code).then(() => setShowConfigCodePopup(true));
            GA.event({ category: 'mods', action: 'export mod' });
        } catch (err) {
            console.error(err);
        }
    }, [GA, selectedMod]);

    const handleDeleteMod = useCallback(() => {
        invoke('delete_mod', { modId: selectedMod.id })
            .then(() => {
                GA.event({ category: 'mods', action: 'delete mod' });
                dispatch(deleteMod(selectedMod.id));
            })
            .catch(console.error);
    }, [GA, selectedMod.id, dispatch]);

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
                                onClick={handleDeleteMod}
                            />
                        </>
                    )}
                </Stack>
            );
        },
        [
            isEditing,
            showConfigCodePopup,
            handleDeleteMod,
            handleSaveChanges,
            handleDiscardChanges,
            handleExportConfigCode,
        ],
    );

    const renderName = useCallback((): ReactNode => {
        return isEditing ? (
            <Input
                variant="flushed"
                maxW="500px"
                fontSize="3xl"
                fontWeight="bold"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Mod Name..."
                mr={4}
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
                variant="flushed"
                mt="-7px"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Enter mod description here..."
                mb={-3}
            />
        ) : (
            <Text mt="3px">{newDescription}</Text>
        );
    }, [isEditing, newDescription]);

    return (
        <Stack spacing={3} ref={editableRef} onKeyDown={handleKeyPress}>
            <Flex direction="row" justifyContent="space-between" alignItems="center">
                {renderName()}
                {renderEditableControls(newName.trim().length !== 0)}
            </Flex>
            <Box>{renderDescription()}</Box>
        </Stack>
    );
}
