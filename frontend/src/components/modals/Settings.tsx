import useGoogleAnalytics from '../../hooks/useGoogleAnalytics';
import TooltipCheckbox, { OptionDetails } from '../forms/TooltipCheckbox';

import {
    Button,
    ButtonGroup,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { GlobalOptions } from '../../types/Configuration';
import { getGlobalOptions } from '../../redux/slices/cornercutter';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { setOptionFlag, hasOptionSet } from '../../utility/ConfigHelpers';
import OptionCheckboxes from '../forms/OptionCheckboxes';

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
    const GA = useGoogleAnalytics();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [updatedOptions, setUpdatedOptions] = useState(globalOptions);
    const hasChangedSettings = updatedOptions !== globalOptions;

    useEffect(() => {
        if (isShown) {
            onOpen();
            setUpdatedOptions(globalOptions);
        } else {
            onClose();
        }
    }, [globalOptions, isShown, onClose, onOpen]);

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
        ifChanged(GlobalOptions.DisableCornercutter, (isSet) => {
            const action = isSet ? 'Disable Cornercutter' : 'Enable Cornercutter';
            GA.event({ category: 'Settings', action });
        });
        ifChanged(GlobalOptions.EnableUserMetrics, (isSet) => {
            const action = isSet ? 'Enable User Metrics' : 'Disable User Metrics';
            GA.event({ category: 'User Metrics', action });
        });

        handleSaveChanges(updatedOptions);
    }, [handleSaveChanges, updatedOptions, GA, ifChanged]);

    const handleDiscard = useCallback(() => {
        handleDiscardChanges();
        onClose();
    }, [handleDiscardChanges, onClose]);

    const setFlag = useCallback(
        (flag: GlobalOptions, isChecked: boolean) => {
            setUpdatedOptions(setOptionFlag(updatedOptions, flag, isChecked) as GlobalOptions);
        },
        [updatedOptions],
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
                    <Text fontSize="xl" py={4}>
                        User Metrics
                    </Text>
                    <Stack>
                        <TooltipCheckbox
                            label="Enable User Metrics"
                            tooltip="Allow us to see how you use Cornercutter."
                            isChecked={true}
                        />
                        <Text fontSize="sm">
                            Allow us to see how you are using Cornercutter. None of the metrics we collect can be linked
                            back to you. You can view our privacy policy{' '}
                            <Link
                                isExternal
                                color="green.300"
                                href="https://github.com/franomai/cornercutter/blob/main/PRIVACY_POLICY.md"
                            >
                                here
                            </Link>
                            .
                        </Text>
                    </Stack>
                </ModalBody>
                <ModalFooter>
                    <ButtonGroup variant="outline">
                        <Button onClick={handleSave} colorScheme={hasChangedSettings ? 'green' : undefined}>
                            Save Changes
                        </Button>
                        <Button onClick={handleDiscard}>Discard Changes</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default Settings;
