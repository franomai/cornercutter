import {
    Button,
    Checkbox,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { setOptionFlag, hasOptionSet } from '../../utility/ConfigHelpers';
import { GlobalOptions } from '../../types/Configuration';
import { useSelector } from 'react-redux';
import { getGlobalOptions } from '../../redux/slices/cornercutter';
import ReactGA from 'react-ga4';

const optionLabels: Record<GlobalOptions, string> = {
    [GlobalOptions.DisableCornercutter]: 'Disable Cornercutter',
    [GlobalOptions.DisableHighscores]: 'Disable highscores',
    [GlobalOptions.DisableSteamAchievements]: 'Disable Steam achievements',
    [GlobalOptions.RespectUnlocks]: 'Only spawn unlocked skills',
    [GlobalOptions.EnableDebugMenu]: 'Enable debug menu',
    [GlobalOptions.EnableExtraLogging]: 'Enable additional Cornercutter logging',
};

const optionTooltips: Record<GlobalOptions, string> = {
    [GlobalOptions.DisableCornercutter]: 'Turns cornercutter off for the next run. No indicator will show in-game.',
    [GlobalOptions.DisableHighscores]:
        'New best times with Cornercutter enabled will not be saved, unless it is the fist clear for that dungeon.',
    [GlobalOptions.DisableSteamAchievements]: 'Turns off steam achievements for progression and unlocks.',
    [GlobalOptions.RespectUnlocks]:
        'While enabled, mods will not spawn items not unlocked in gain - effectively, the pool will be reduced.',
    [GlobalOptions.EnableDebugMenu]: 'Activates the debug menu in the pause screen.',
    [GlobalOptions.EnableExtraLogging]: 'Adds some extra logging to Cornercutter to help diagnose spawning issues.',
};

const Settings = ({
    isShown,
    handleSaveChanges,
    handleDiscardChanges,
}: {
    isShown: boolean;
    handleDiscardChanges(): void;
    handleSaveChanges(settings: GlobalOptions): void;
}) => {
    const globalOptions = useSelector(getGlobalOptions);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [updatedSettings, setUpdatedSettings] = useState(globalOptions);

    useEffect(() => {
        if (isShown) {
            onOpen();
            setUpdatedSettings(globalOptions);
        } else {
            onClose();
        }
    }, [globalOptions, isShown, onClose, onOpen]);

    const handleSave = useCallback(() => {
        const hasSetDisableCornercutter = hasOptionSet(updatedSettings, GlobalOptions.DisableCornercutter);
        const updatedDisableCornercutter =
            hasSetDisableCornercutter !== hasOptionSet(globalOptions, GlobalOptions.DisableCornercutter);

        if (updatedDisableCornercutter) {
            const action = hasSetDisableCornercutter ? 'Disable Cornercutter' : 'Enable Cornercutter';
            ReactGA.event({ category: 'Settings', action });
        }

        handleSaveChanges(updatedSettings);
    }, [handleSaveChanges, updatedSettings, globalOptions]);

    const handleDiscard = useCallback(() => {
        handleDiscardChanges();
        onClose();
    }, [handleDiscardChanges, onClose]);

    function setFlag(flag: GlobalOptions, isChecked: boolean) {
        setUpdatedSettings(setOptionFlag(updatedSettings, flag, isChecked) as GlobalOptions);
    }

    function renderOptionCheckbox(flag: GlobalOptions, label: string, tooltip: string): ReactNode {
        return (
            <Checkbox
                key={flag}
                isChecked={hasOptionSet(updatedSettings, flag)}
                onChange={(e) => setFlag(flag, e.target.checked)}
            >
                <Tooltip hasArrow label={tooltip} aria-label="More info" placement="top" openDelay={700}>
                    {label}
                </Tooltip>
            </Checkbox>
        );
    }

    function renderOptionCheckboxes(flags: GlobalOptions[]): ReactNode {
        return (
            <Stack spacing={2}>
                {flags.map((flag) => renderOptionCheckbox(flag, optionLabels[flag], optionTooltips[flag]))}
            </Stack>
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                handleDiscardChanges();
                onClose();
            }}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Global Option</ModalHeader>
                <ModalBody>
                    {renderOptionCheckboxes([
                        GlobalOptions.DisableCornercutter,
                        GlobalOptions.DisableHighscores,
                        GlobalOptions.DisableSteamAchievements,
                        GlobalOptions.RespectUnlocks,
                        GlobalOptions.EnableDebugMenu,
                        GlobalOptions.EnableExtraLogging,
                    ])}
                </ModalBody>
                <ModalFooter gap={2}>
                    <Button onClick={handleSave} variant="outline">
                        Save Changes
                    </Button>
                    <Button onClick={handleDiscard} variant="outline">
                        Discard Changes
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default Settings;
