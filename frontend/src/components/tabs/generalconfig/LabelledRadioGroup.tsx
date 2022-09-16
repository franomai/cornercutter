import { RadioGroup, RadioGroupProps, Stack, StackProps, Text, Tooltip } from '@chakra-ui/react';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';

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
        <Stack spacing={1.5}>
            <Stack direction="row" spacing={3} alignItems="center">
                <Text fontSize="xl" fontWeight="semibold">
                    {title}
                </Text>
                <Tooltip hasArrow label={tooltip} aria-label="More info" placement="top">
                    <FontAwesomeIcon icon={faCircleQuestion} />
                </Tooltip>
            </Stack>
            <RadioGroup onChange={onChange} value={value}>
                <Stack direction={direction} spacing={5}>
                    {children}
                </Stack>
            </RadioGroup>
        </Stack>
    );
};

export default LabelledRadioGroup;
