import { Flex } from '@chakra-ui/react';
import { ReactNode, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addFloorSkill, clearFloorSkills, deleteFloorSkill, updateFloorSkillWeight } from '../../redux/slices/mod';
import ModConfig, { Floor, Options, Room } from '../../types/Configuration';
import { modHasOption } from '../../utility/ConfigHelpers';
import LabelledDropzone from '../dropzone';
import HelpIcon from '../helpicon';
import SideSearchColumnLayout from '../layout/SideSearchColumnLayout';

const roomLabels: Record<string, ReactNode> = {
    [Room.Skill]: (
        <Flex alignItems="center" gap={2} ml={-2}>
            <HelpIcon
                tooltip="If a pedastral treasure spawns it will pull from this skill pool too."
                placement="left"
                size="sm"
            />
            {Room.Skill}
        </Flex>
    ),
    [Room.All]: 'All Rooms',
};

const FloorConfigTab = ({ selectedMod, floor }: { selectedMod: ModConfig; floor: Floor; floorLabel: string }) => {
    const dispatch = useDispatch();

    const renderDropzone = useCallback(
        (room: Room, singleRow: boolean) => {
            return (
                <LabelledDropzone
                    key={room}
                    singleRow={singleRow}
                    rotateLabel={singleRow}
                    skills={selectedMod.floorSkills[floor][room]}
                    label={roomLabels[room] ?? room}
                    handleClearAllSkills={() => dispatch(clearFloorSkills({ floor, room }))}
                    handleDeleteSkill={(skillIndex) => dispatch(deleteFloorSkill({ floor, room, skillIndex }))}
                    handleDropSkill={(weightedSkill) => dispatch(addFloorSkill({ floor, room, skill: weightedSkill }))}
                    handleUpdateSkillWeight={(skillIndex, newWeight) =>
                        dispatch(updateFloorSkillWeight({ floor, room, skillIndex, newWeight }))
                    }
                />
            );
        },
        [dispatch, selectedMod.floorSkills[floor]],
    );

    const renderDropzones = useCallback((): ReactNode => {
        if (modHasOption(selectedMod, Options.ConfigPerRoom)) {
            return [Room.Skill, Room.Shop, Room.Curse, Room.Finale].map((room) => renderDropzone(room, true));
        }

        return renderDropzone(Room.All, false);
    }, [selectedMod.general, selectedMod.floorSkills[floor]]);

    return <SideSearchColumnLayout>{renderDropzones()}</SideSearchColumnLayout>;
};

export default FloorConfigTab;
