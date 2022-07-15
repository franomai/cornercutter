import { FC } from 'react';
import DropTarget from '../components/dragdrop/DropTarget';
import Skill from '../components/dragdrop/Skill';

const Test: FC = () => {
    return (
        <div>
            <DropTarget onItemDropped={console.log}>Drop stuff here!</DropTarget>
            <Skill id="1" name="Test skill" />
        </div>
    );
};

export default Test;
