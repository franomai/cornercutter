import { Center, ResponsiveValue, SimpleGrid, Text } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import { skillFromId } from '../../data/TestSkills';
import { Item } from '../../types/ItemTypes';
import Dropzone from './Dropzone';
import SelectedSkill from './SelectedSkill';

interface Props {
    skillIds: number[];
    addSkill: (skill: Item) => void;
    removeSkill: (index: number) => void;
    columns?: ResponsiveValue<number>;
}

const SkillSelector: FC<Props> = (props) => {
    function renderSkills(): ReactNode {
        return props.skillIds.map((itemId, index) => (
            <SelectedSkill key={index} item={skillFromId(itemId)} onRemoveSkill={() => props.removeSkill(index)} />
        ));
    }

    return (
        <Dropzone onItemDropped={props.addSkill}>
            {props.skillIds.length !== 0 ? (
                <SimpleGrid columns={props.columns} gap={4}>
                    {renderSkills()}
                </SimpleGrid>
            ) : (
                <Center h="full">
                    <Text fontSize="xl">Drag skills here to select them</Text>
                </Center>
            )}
        </Dropzone>
    );
};

export default SkillSelector;
