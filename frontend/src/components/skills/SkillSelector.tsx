import { FC, ReactNode } from 'react';
import { skillFromId } from '../../data/TestSkills';
import { Item } from '../../types/ItemTypes';
import { ItemTypes } from '../ItemTypeDefinitions';
import Dropzone from './Dropzone';
import SelectedSkill from './SelectedSkill';

interface Props {
    skillIds: number[];
    addSkill: (skill: Item) => void;
    removeSkill: (index: number) => void;
}

const SkillSelector: FC<Props> = (props) => {
    function renderSkills(): ReactNode {
        return props.skillIds.map((itemId, index) => <SelectedSkill key={index} item={skillFromId(itemId)} />);
    }

    return (
        <>
            <Dropzone itemType={ItemTypes.SKILL} onItemDropped={props.addSkill} />
            {renderSkills()}
        </>
    );
};

export default SkillSelector;
