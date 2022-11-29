import OptionCheckboxes from '../forms/OptionCheckboxes';
import useGoogleAnalytics from '../../hooks/useGoogleAnalytics';
import EnableUserMetricsSection from './sections/EnableUserMetricsSection';

import {
    getEnableUserMetrics,
    getGlobalOptions,
    setEnableUserMetrics,
    setGlobalOptions,
} from '../../redux/slices/cornercutter';
import {
    Button,
    ButtonGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from '@chakra-ui/react';
import { invoke } from '@tauri-apps/api';
import { useDispatch, useSelector } from 'react-redux';
import { OptionDetails } from '../forms/TooltipCheckbox';
import { GlobalOptions } from '../../types/Configuration';
import { setOptionFlag, hasOptionSet } from '../../utility/ConfigHelpers';
import { RefObject, useCallback, useEffect, useMemo, useState } from 'react';

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
};

const Settings = ({ openRef }: { openRef: RefObject<HTMLButtonElement> }) => {
    const dispatch = useDispatch();
    const GA = useGoogleAnalytics();
    const globalOptions = useSelector(getGlobalOptions);
    const enableUserMetrics = useSelector(getEnableUserMetrics);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [updatedOptions, setUpdatedOptions] = useState(globalOptions);
    const [updatedEnableUserMetrics, setUpdatedEnableUserMetrics] = useState(enableUserMetrics);

    const hasChangedEnableUserMetrics = useMemo(
        () => updatedEnableUserMetrics !== enableUserMetrics,
        [updatedEnableUserMetrics, enableUserMetrics],
    );

    const hasChangedSettings = useMemo(
        () => updatedOptions !== globalOptions || hasChangedEnableUserMetrics,
        [updatedOptions, globalOptions, hasChangedEnableUserMetrics],
    );

    useEffect(() => {
        const handler = () => onOpen();
        const current = openRef.current;
        current?.addEventListener('click', handler);

        return () => current?.removeEventListener('click', handler);
    }, [openRef, onOpen]);

    const ifChanged = useCallback(
        (flag: GlobalOptions, callback: (isSet: boolean) => void) => {
            const newValue = hasOptionSet(updatedOptions, flag);
            const hasChanged = newValue !== hasOptionSet(globalOptions, flag);
            if (hasChanged) {
                callback(newValue);
            }
        },
        [updatedOptions, globalOptions],
    );

    const handleSave = useCallback(() => {
        if (hasChangedSettings) {
            ifChanged(GlobalOptions.DisableCornercutter, (isSet) => {
                const action = isSet ? 'Disable Cornercutter' : 'Enable Cornercutter';
                GA.event({ category: 'Settings', action });
            });
            if (hasChangedEnableUserMetrics) {
                const action = updatedEnableUserMetrics ? 'Enable User Metrics' : 'Disable User Metrics';
                GA.event({ category: 'User Metrics', action });
            }

            Promise.all([
                invoke('set_global_options', { options: updatedOptions }),
                invoke('set_enable_user_metrics', { enableUserMetrics: updatedEnableUserMetrics }),
            ]).then(() => {
                dispatch(setGlobalOptions(updatedOptions));
                dispatch(setEnableUserMetrics(updatedEnableUserMetrics));
            });
        }
        onClose();
    }, [
        GA,
        updatedOptions,
        hasChangedSettings,
        updatedEnableUserMetrics,
        hasChangedEnableUserMetrics,
        dispatch,
        ifChanged,
        onClose,
    ]);

    const handleDiscard = useCallback(() => {
        setUpdatedOptions(globalOptions);
        setUpdatedEnableUserMetrics(enableUserMetrics);
        onClose();
    }, [globalOptions, enableUserMetrics, onClose]);

    const setFlag = useCallback(
        (flag: GlobalOptions, isChecked: boolean) => {
            setUpdatedOptions(setOptionFlag(updatedOptions, flag, isChecked) as GlobalOptions);
        },
        [updatedOptions],
    );

    return (
        <Modal isOpen={isOpen} onClose={handleSave}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Global Option</ModalHeader>
                <ModalCloseButton onClick={handleSave} title="Save changes" />
                <ModalBody>
                    <OptionCheckboxes<GlobalOptions>
                        flags={[
                            GlobalOptions.DisableCornercutter,
                            GlobalOptions.DisableHighscores,
                            GlobalOptions.DisableSteamAchievements,
                            GlobalOptions.RespectUnlocks,
                            GlobalOptions.EnableDebugMenu,
                            GlobalOptions.EnableExtraLogging,
                        ]}
                        optionDetails={optionDetails}
                        options={updatedOptions}
                        handleChange={setFlag}
                    />
                    <EnableUserMetricsSection
                        isEnabled={updatedEnableUserMetrics}
                        setIsEnabled={setUpdatedEnableUserMetrics}
                    />
                </ModalBody>
                <ModalFooter>
                    <ButtonGroup variant="outline">
                        <Button title="Discard any changes made to the settings" onClick={handleDiscard}>
                            Discard Changes
                        </Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default Settings;
