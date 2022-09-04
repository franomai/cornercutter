import { FC } from 'react';
import { Floor } from '../../types/Configuration';

interface Props {
    floor: Floor;
}

const FloorConfigTab: FC<Props> = (props) => {
    return <div>{props.floor}</div>;
};

export default FloorConfigTab;
