import { Flex, Stack, Text } from '@chakra-ui/react';
import { ReactNode, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addFloorSkill, clearFloorSkills, deleteFloorSkill, updateFloorSkillWeight } from '../../redux/slices/mod';
import ModConfig, { Floor, Options, Room } from '../../types/Configuration';
import { WeightedSkill } from '../../types/Skill';
import { modHasOption } from '../../utility/ConfigHelpers';
import { newArray, newMap } from '../../utility/Utils';
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
    const dispatch = useDispatch();

    const renderDropzones = useCallback((): ReactNode => {
        if (modHasOption(selectedMod, Options.ConfigPerRoom)) {
            return [Room.Skill, Room.Shop, Room.Curse, Room.Finale].map((room) => (
                <LabelledDropzone
                    key={room}
                    singleRow
                    rotateLabel
                    skills={selectedMod.floorSkills[floor][room]}
                    label={
                        room === Room.Skill ? (
                            <Flex alignItems="center" gap={2} ml={-2}>
                                <HelpIcon
                                    tooltip="If a pedastral treasure spawns it will pull from this skill pool too."
                                    placement="left"
                                    size="sm"
                                />
                                {room}
                            </Flex>
                        ) : (
                            room
                        )
                    }
                    handleClearAllSkills={() => dispatch(clearFloorSkills({ floor, room }))}
                    handleDeleteSkill={(skillIndex) => dispatch(deleteFloorSkill({ floor, room, skillIndex }))}
                    handleDropSkill={(weightedSkill) => dispatch(addFloorSkill({ floor, room, skill: weightedSkill }))}
                    handleUpdateSkillWeight={(skillIndex, newWeight) =>
                        dispatch(updateFloorSkillWeight({ floor, room, skillIndex, newWeight }))
                    }
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
