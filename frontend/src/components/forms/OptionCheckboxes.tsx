import { Stack } from '@chakra-ui/react';
import { useCallback } from 'react';
import { GlobalOptions, ModOptions } from '../../types/Configuration';
import { hasOptionSet } from '../../utility/ConfigHelpers';
import TooltipCheckbox, { OptionDetails } from './TooltipCheckbox';

interface OptionCheckboxesProps<T extends ModOptions | GlobalOptions> {
    flags: T[];
    optionDetails: Record<T, OptionDetails>;
    options: T;
    handleChange(flag: T, isEnabled: boolean): void;
}

export default function OptionCheckboxes<T extends ModOptions | GlobalOptions>({
    flags,
    optionDetails,
    options,
    handleChange,
}: OptionCheckboxesProps<T>) {
    const renderOptionCheckbox = useCallback(
        (flag: T) => {
            const optionDetail = optionDetails[flag];
            return (
                <TooltipCheckbox
                    key={flag}
                    isChecked={hasOptionSet(options, flag)}
                    onChange={(e) => handleChange(flag, e.target.checked)}
                    {...optionDetail}
                />
            );
        },
        [handleChange, optionDetails, options],
    );

    return <Stack spacing={2}>{flags.map((flag) => renderOptionCheckbox(flag))}</Stack>;
}
