import { FC } from 'react';
import DropZone from '../components/dragdrop/DropTarget';
import Skill from '../components/dragdrop/Skill';
import { ItemType } from '../types/ItemTypes';

const Test: FC = () => {
    return (
        <div>
            <DropZone itemType={ItemType.SKILL} onItemDropped={console.log} />
            <Skill id="1" name="Test skill" />
        </div>
    );
};

export default Test;
