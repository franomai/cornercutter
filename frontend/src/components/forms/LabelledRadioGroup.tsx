import HelpIcon from './HelpIcon';

import { ReactNode } from 'react';
import { RadioGroup, RadioGroupProps, Stack, StackProps, Text } from '@chakra-ui/react';

interface LabelledRadioGroupProps {
    title: string;
    tooltip: string;
    direction?: StackProps['direction'];
    value?: RadioGroupProps['value'];
    onChange?: RadioGroupProps['onChange'];
    children?: ReactNode;
}

export default function LabelledRadioGroup({
    title,
    tooltip,
    direction = 'row',
    value,
    onChange,
    children,
}: LabelledRadioGroupProps) {
    return (
        <Stack spacing={3}>
            <Stack direction="row" spacing={3} alignItems="center">
                <Text fontSize="xl" fontWeight="semibold">
                    {title}
                </Text>
                <HelpIcon tooltip={tooltip} />
            </Stack>
            <RadioGroup onChange={onChange} value={value}>
                <Stack direction={direction} spacing={6}>
                    {children}
                </Stack>
            </RadioGroup>
        </Stack>
    );
}
