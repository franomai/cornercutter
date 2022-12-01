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
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from '@chakra-ui/react';
import { invoke } from '@tauri-apps/api';
import { useDispatch, useSelector } from 'react-redux';
import { OptionDetails } from '../forms/TooltipCheckbox';
import { RefObject, useCallback, useEffect } from 'react';
import { GlobalOptions } from '../../types/Configuration';
import { setOptionFlag } from '../../utility/ConfigHelpers';

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

export default function Settings({ openRef }: { openRef: RefObject<HTMLButtonElement> }) {
    const dispatch = useDispatch();
    const GA = useGoogleAnalytics();
    const globalOptions = useSelector(getGlobalOptions);
    const enableUserMetrics = useSelector(getEnableUserMetrics);

    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        const handler = () => onOpen();
        const current = openRef.current;
        current?.addEventListener('click', handler);

        return () => current?.removeEventListener('click', handler);
    }, [openRef, onOpen]);

    const handleUpdateEnableUserMetrics = useCallback(
        (enableUserMetrics: boolean) => {
            invoke('set_enable_user_metrics', { enableUserMetrics }).then(() =>
                dispatch(setEnableUserMetrics(enableUserMetrics)),
            );
        },
        [dispatch],
    );

    const handleSetFlag = useCallback(
        (flag: GlobalOptions, isChecked: boolean) => {
            const updatedOptions = setOptionFlag(globalOptions, flag, isChecked) as GlobalOptions;
            if (flag === GlobalOptions.DisableCornercutter) {
                const action = isChecked ? 'Disable Cornercutter' : 'Enable Cornercutter';
                GA.event({ category: 'Settings', action });
            }
            invoke('set_global_options', { options: updatedOptions }).then(() =>
                dispatch(setGlobalOptions(updatedOptions)),
            );
        },
        [GA, globalOptions, dispatch],
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Global Option</ModalHeader>
                <ModalCloseButton title="Save changes" />
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
                        options={globalOptions}
                        handleChange={handleSetFlag}
                    />
                    <EnableUserMetricsSection
                        isEnabled={enableUserMetrics}
                        setIsEnabled={handleUpdateEnableUserMetrics}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
