import TooltipCheckbox, { OptionDetails } from './TooltipCheckbox';

import { useCallback } from 'react';
import { Stack } from '@chakra-ui/react';
import { hasOptionSet } from '../../utility/ConfigHelpers';
import { GlobalOptions, ModOptions } from '../../types/Configuration';

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
        [optionDetails, options, handleChange],
    );

    return <Stack spacing={2}>{flags.map((flag) => renderOptionCheckbox(flag))}</Stack>;
}
