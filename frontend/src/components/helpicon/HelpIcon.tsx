import { PlacementWithLogical, Tooltip } from '@chakra-ui/react';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const HelpIcon = ({
    tooltip,
    size,
    placement,
}: {
    tooltip: string;
    size?: SizeProp;
    placement?: PlacementWithLogical;
}) => {
    return (
        <Tooltip hasArrow label={tooltip} aria-label="More info" placement={placement ?? 'top'} lineHeight={1.3} py={1}>
            <FontAwesomeIcon icon={faCircleQuestion} size={size} />
        </Tooltip>
    );
};

export default HelpIcon;
