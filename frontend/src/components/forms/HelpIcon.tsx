import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { PlacementWithLogical, Tooltip } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';

interface HelpIconProps {
    tooltip: string;
    size?: SizeProp;
    placement?: PlacementWithLogical;
}

export default function HelpIcon({ tooltip, size, placement }: HelpIconProps) {
    return (
        <Tooltip hasArrow label={tooltip} aria-label="More info" placement={placement ?? 'top'} lineHeight={1.3} py={1}>
            <FontAwesomeIcon icon={faCircleQuestion} size={size} />
        </Tooltip>
    );
}
