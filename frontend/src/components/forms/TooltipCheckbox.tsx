import { Checkbox, CheckboxProps, Tooltip } from '@chakra-ui/react';

export interface OptionDetails {
    label: string;
    tooltip: string;
}

export default function TooltipCheckbox({ tooltip, label, ...checkboxProps }: OptionDetails & CheckboxProps) {
    return (
        <Checkbox {...checkboxProps}>
            <Tooltip hasArrow label={tooltip} aria-label="More info" placement="top" openDelay={700}>
                <span tabIndex={-1}>{label}</span>
            </Tooltip>
        </Checkbox>
    );
}
