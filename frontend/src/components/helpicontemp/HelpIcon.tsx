import { Tooltip } from '@chakra-ui/react';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const HelpIcon = ({ tooltip, size }: { tooltip: string; size?: SizeProp }) => {
    return (
        <Tooltip hasArrow label={tooltip} aria-label="More info" placement="top" lineHeight={1.3} py={1}>
            <FontAwesomeIcon icon={faCircleQuestion} size={size} />
        </Tooltip>
    );
};

export default HelpIcon;
