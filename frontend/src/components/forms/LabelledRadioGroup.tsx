import { RadioGroup, RadioGroupProps, Stack, StackProps, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import HelpIcon from './HelpIcon';

const LabelledRadioGroup = ({
    title,
    tooltip,
    direction = 'row',
    value,
    onChange,
    children,
}: {
    title: string;
    tooltip: string;
    direction?: StackProps['direction'];
    value?: RadioGroupProps['value'];
    onChange?: RadioGroupProps['onChange'];
    children?: ReactNode;
}) => {
    return (
        <Stack spacing={3}>
            <Stack direction="row" spacing={3} alignItems="center">
                <Text fontSize={{ base: 'lg', '2xl': 'xl' }} fontWeight="semibold">
                    {title}
                </Text>
                <HelpIcon tooltip={tooltip} />
            </Stack>
            <RadioGroup onChange={onChange} value={value}>
                <Stack direction={direction} spacing={{ base: 4, '2xl': 6 }}>
                    {children}
                </Stack>
            </RadioGroup>
        </Stack>
    );
};

export default LabelledRadioGroup;
