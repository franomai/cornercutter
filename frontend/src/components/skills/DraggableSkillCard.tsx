import { useDrag } from 'react-dnd';
import { ItemType } from '../../types/ItemTypes';
import SkillCard, { SkillCardProps } from './SkillCard';

const DraggableSkillCard = ({ skill, ...skillCardProps }: SkillCardProps) => {
    const [, dragRef] = useDrag(() => ({
        type: ItemType.SKILL,
        item: { id: skill.id },
    }));

    return <SkillCard ref={dragRef} skill={skill} style={{ cursor: 'move' }} {...skillCardProps} />;
};

export default DraggableSkillCard;
