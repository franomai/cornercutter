import { useDrag } from 'react-dnd';
import { ItemType } from '../../types/ItemTypes';
import SkillCard, { SkillCardProps } from './SkillCard';

const DraggableSkillCard = ({ skill, ...skillCardProps }: SkillCardProps) => {
    const [, dragRef] = useDrag(() => ({
        type: ItemType.SKILL,
        item: skill,
    }));

    return <SkillCard ref={dragRef} skill={skill} style={{ cursor: 'move' }} {...skillCardProps} />;
};

export default DraggableSkillCard;
