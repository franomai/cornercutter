import SkillCard, { SkillCardProps } from './SkillCard';

import { useDrag } from 'react-dnd';
import { ItemType } from '../../types/enums/ItemType';

export default function DraggableSkillCard({ skill, ...skillCardProps }: SkillCardProps) {
    const [, dragRef] = useDrag(() => ({
        type: ItemType.SKILL,
        item: { id: skill.id },
    }));

    return <SkillCard ref={dragRef} skill={skill} style={{ cursor: 'move' }} {...skillCardProps} />;
}
