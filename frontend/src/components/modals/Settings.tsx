import OptionCheckboxes from '../forms/OptionCheckboxes';
import useSavingContext from '../../contexts/SavingContext';
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
import { RefObject, useCallback, useEffect } from 'react';
import { setOptionFlag } from '../../utility/ConfigHelpers';
import { globalOptionDetails, GlobalOptions } from '../../types/enums/GlobalOptions';

export default function Settings({ openRef }: { openRef: RefObject<HTMLButtonElement> }) {
    const dispatch = useDispatch();
    const GA = useGoogleAnalytics();
    const globalOptions = useSelector(getGlobalOptions);
    const enableUserMetrics = useSelector(getEnableUserMetrics);

    const { save, setError } = useSavingContext();
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        const handler = () => onOpen();
        const current = openRef.current;
        current?.addEventListener('click', handler);

        return () => current?.removeEventListener('click', handler);
    }, [openRef, onOpen]);

    const handleUpdateEnableUserMetrics = useCallback(
        (enableUserMetrics: boolean) => {
            invoke('set_enable_user_metrics', { enableUserMetrics })
                .then(() => dispatch(setEnableUserMetrics(enableUserMetrics)))
                .catch(setError);
            save();
        },
        [save, setError, dispatch],
    );

    const handleSetFlag = useCallback(
        (flag: GlobalOptions, isChecked: boolean) => {
            const updatedOptions = setOptionFlag(globalOptions, flag, isChecked) as GlobalOptions;
            if (flag === GlobalOptions.DisableCornercutter) {
                const action = isChecked ? 'Disable Cornercutter' : 'Enable Cornercutter';
                GA.event({ category: 'Settings', action });
            }
            invoke('set_global_options', { options: updatedOptions })
                .then(() => dispatch(setGlobalOptions(updatedOptions)))
                .catch(setError);
            save();
        },
        [GA, globalOptions, save, setError, dispatch],
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Global Settings</ModalHeader>
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
                            GlobalOptions.EnsureAlwaysFiveCubitShopOptions,
                            GlobalOptions.EnableFreeCubitShop,
                        ]}
                        optionDetails={globalOptionDetails}
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
