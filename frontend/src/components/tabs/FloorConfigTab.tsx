import { Flex, Stack, Text } from '@chakra-ui/react';
import { ReactNode, useCallback } from 'react';
import ModConfig, { Floor, Options, Room } from '../../types/Configuration';
import { WeightedSkill } from '../../types/Skill';
import { modHasOption } from '../../utility/ConfigHelpers';
import LabelledDropzone from '../dropzone';
import HelpIcon from '../helpicon';
import SideSearchColumnLayout from '../layout/SideSearchColumnLayout';

const FloorConfigTab = ({
    selectedMod,
    floor,
    floorLabel,
}: {
    selectedMod: ModConfig;
    floor: Floor;
    floorLabel: string;
}) => {
    const renderDropzones = useCallback((): ReactNode => {
        if (modHasOption(selectedMod, Options.ConfigPerRoom)) {
            return [Room.Skill, Room.Shop, Room.Curse, Room.Finale].map((room) => (
                <LabelledDropzone
                    key={room}
                    singleRow
                    rotateLabel
                    label={room}
                    handleClearAllSkills={function (): void {
                        throw new Error('Function not implemented.');
                    }}
                    skills={[]}
                    handleDeleteSkill={function (skillIndex: number): void {
                        throw new Error('Function not implemented.');
                    }}
                    handleDropSkill={function (weightedSkill: WeightedSkill): void {
                        throw new Error('Function not implemented.');
                    }}
                    handleUpdateSkillWeight={function (skillIndex: number, newWeight: number): void {
                        throw new Error('Function not implemented.');
                    }}
                />
            ));
        }

        return (
            <LabelledDropzone
                label="All Rooms"
                handleClearAllSkills={() => {}}
                skills={[]}
                handleDeleteSkill={function (skillIndex: number): void {
                    throw new Error('Function not implemented.');
                }}
                handleDropSkill={function (weightedSkill: WeightedSkill): void {
                    throw new Error('Function not implemented.');
                }}
                handleUpdateSkillWeight={function (skillIndex: number, newWeight: number): void {
                    throw new Error('Function not implemented.');
                }}
            />
        );
    }, [selectedMod]);

    return <SideSearchColumnLayout>{renderDropzones()}</SideSearchColumnLayout>;
};

export default FloorConfigTab;
