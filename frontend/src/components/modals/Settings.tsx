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
import { allValues } from '../../utility/Utils';

interface OptionDetails {
    label: string;
    tooltip: string;
}

const optionDetails: Record<GlobalOptions, OptionDetails> = {
    [GlobalOptions.DisableCornercutter]: {
        label: 'Disable Cornercutter',
        tooltip: 'Turns cornercutter off for the next run. No indicator will show in-game.',
    },
    [GlobalOptions.DisableHighscores]: {
        label: 'Disable highscores',
        tooltip:
            'New best times with Cornercutter enabled will not be saved, unless it is the fist clear for that dungeon.',
    },

    [GlobalOptions.DisableSteamAchievements]: {
        label: 'Disable Steam achievements',
        tooltip: 'Turns off steam achievements for progression and unlocks.',
    },

    [GlobalOptions.RespectUnlocks]: {
        label: 'Only spawn unlocked skills',
        tooltip:
            'While enabled, mods will not spawn items not unlocked in gain - effectively, the pool will be reduced.',
    },
    [GlobalOptions.EnableDebugMenu]: {
        label: 'Enable debug menu',
        tooltip: 'Activates the debug menu in the pause screen.',
    },

    [GlobalOptions.EnableExtraLogging]: {
        label: 'Enable additional Cornercutter logging',
        tooltip: 'Adds some extra logging to Cornercutter to help diagnose spawning issues.',
    },

    [GlobalOptions.EnableUserMetrics]: {
        label: 'Enable user metrics',
        tooltip: 'Allow us to see how you use Cornercutter.',
    },
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
        const hasDisabledCornercutter = hasOptionSet(updatedSettings, GlobalOptions.DisableCornercutter);
        const hasUpdatedDisableCornercutter =
            hasDisabledCornercutter !== hasOptionSet(globalOptions, GlobalOptions.DisableCornercutter);

        if (hasUpdatedDisableCornercutter) {
            const action = hasDisabledCornercutter ? 'Disable Cornercutter' : 'Enable Cornercutter';
            ReactGA.event({ category: 'Settings', action });
        }

        handleSaveChanges(updatedSettings);
    }, [handleSaveChanges, updatedSettings, globalOptions]);

    const handleDiscard = useCallback(() => {
        handleDiscardChanges();
        onClose();
    }, [handleDiscardChanges, onClose]);

    function setFlag(flag: GlobalOptions, isChecked: boolean) {
        console.log(updatedSettings);
        setUpdatedSettings(setOptionFlag(updatedSettings, flag, isChecked) as GlobalOptions);
    }

    function renderOptionCheckbox(flag: GlobalOptions): ReactNode {
        const details = optionDetails[flag];
        return (
            <Checkbox
                key={flag}
                isChecked={hasOptionSet(updatedSettings, flag)}
                onChange={(e) => setFlag(flag, e.target.checked)}
            >
                <Tooltip hasArrow label={details.label} aria-label="More info" placement="top" openDelay={700}>
                    {details.label}
                </Tooltip>
            </Checkbox>
        );
    }

    function getOptions(): GlobalOptions[] {
        return [
            GlobalOptions.DisableCornercutter,
            GlobalOptions.DisableHighscores,
            GlobalOptions.DisableSteamAchievements,
            GlobalOptions.RespectUnlocks,
            GlobalOptions.EnableDebugMenu,
            GlobalOptions.EnableExtraLogging,
            GlobalOptions.EnableUserMetrics,
        ];
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
                    <Stack spacing={2}>{getOptions().map((flag) => renderOptionCheckbox(flag))}</Stack>
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
