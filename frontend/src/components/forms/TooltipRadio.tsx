import { Radio, RadioProps, Tooltip } from '@chakra-ui/react';
import { ReactNode } from 'react';

const TooltipRadio = ({ tooltip, ...radioProps }: { tooltip: ReactNode } & RadioProps) => {
    return (
        <Tooltip hasArrow label={tooltip} aria-label="More info" placement="top" openDelay={700}>
            <span>
                <Radio {...radioProps} />
            </span>
        </Tooltip>
    );
};

export default TooltipRadio;
