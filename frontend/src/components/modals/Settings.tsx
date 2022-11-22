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
import useGoogleAnalytics from '../../hooks/useGoogleAnalytics';

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

const AllOptions = [
    GlobalOptions.DisableCornercutter,
    GlobalOptions.DisableHighscores,
    GlobalOptions.DisableSteamAchievements,
    GlobalOptions.RespectUnlocks,
    GlobalOptions.EnableDebugMenu,
    GlobalOptions.EnableExtraLogging,
    GlobalOptions.EnableUserMetrics,
];

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
    const GA = useGoogleAnalytics();

    useEffect(() => {
        if (isShown) {
            onOpen();
            setUpdatedSettings(globalOptions);
        } else {
            onClose();
        }
    }, [globalOptions, isShown, onClose, onOpen]);

    const ifChanged = useCallback(
        (flag: GlobalOptions, callback: (isSet: boolean) => void) => {
            const newValue = hasOptionSet(updatedSettings, flag);
            const hasChanged = newValue !== hasOptionSet(globalOptions, flag);
            if (hasChanged) {
                callback(newValue);
            }
        },
        [updatedSettings, globalOptions],
    );

    const handleSave = useCallback(() => {
        ifChanged(GlobalOptions.DisableCornercutter, (isSet) => {
            const action = isSet ? 'Disable Cornercutter' : 'Enable Cornercutter';
            GA.event({ category: 'Settings', action });
        });
        ifChanged(GlobalOptions.EnableUserMetrics, (isSet) => {
            const action = isSet ? 'Enable User Metrics' : 'Disable User Metrics';
            GA.event({ category: 'User Metrics', action });
        });

        handleSaveChanges(updatedSettings);
    }, [handleSaveChanges, updatedSettings, GA, ifChanged]);

    const handleDiscard = useCallback(() => {
        handleDiscardChanges();
        onClose();
    }, [handleDiscardChanges, onClose]);

    const setFlag = useCallback(
        (flag: GlobalOptions, isChecked: boolean) => {
            setUpdatedSettings(setOptionFlag(updatedSettings, flag, isChecked) as GlobalOptions);
        },
        [updatedSettings],
    );

    const renderOptionCheckbox = useCallback(
        (flag: GlobalOptions): ReactNode => {
            const details = optionDetails[flag];
            return (
                <Checkbox
                    isChecked={hasOptionSet(updatedSettings, flag)}
                    onChange={(e) => setFlag(flag, e.target.checked)}
                >
                    <Tooltip
                        key={flag}
                        hasArrow
                        label={details.label}
                        aria-label="More info"
                        placement="top"
                        openDelay={700}
                    >
                        <span tabIndex={-1}>{details.label}</span>
                    </Tooltip>
                </Checkbox>
            );
        },
        [setFlag, updatedSettings],
    );

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
                    <Stack spacing={2}>{AllOptions.map((flag) => renderOptionCheckbox(flag))}</Stack>
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
