import { ReactNode } from 'react';
import { Radio, RadioProps, Tooltip } from '@chakra-ui/react';

interface TooltipRadioProps extends RadioProps {
    tooltip: ReactNode;
}

export default function TooltipRadio({ tooltip, ...radioProps }: TooltipRadioProps) {
    return (
        <Tooltip hasArrow label={tooltip} aria-label="More info" placement="top" openDelay={700}>
            <span>
                <Radio {...radioProps} />
            </span>
        </Tooltip>
    );
}
