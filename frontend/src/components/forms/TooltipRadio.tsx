import { Radio, RadioProps, Text, Tooltip } from '@chakra-ui/react';
import { ReactNode } from 'react';

const TooltipRadio = ({ tooltip, ...radioProps }: { tooltip: ReactNode } & RadioProps) => {
    return (
        <Tooltip hasArrow label={tooltip} aria-label="More info" placement="top" openDelay={700}>
            <span>
                <Radio fontSize="sm" {...radioProps}>
                    {radioProps.children && <Text fontSize={{ base: 'sm', '2xl': 'md' }}>{radioProps.children}</Text>}
                </Radio>
            </span>
        </Tooltip>
    );
};

export default TooltipRadio;
