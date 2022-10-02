import { Flex } from '@chakra-ui/react';
import { ReactNode, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addFloorSkill, clearFloorSkills, deleteFloorSkill, updateFloorSkillWeight } from '../../redux/slices/mod';
import ModConfig, { Floor, Options, Room } from '../../types/Configuration';
import { modHasOption } from '../../utility/ConfigHelpers';
import { capitalise } from '../../utility/Utils';
import LabelledDropzone from '../dropzone';
import HelpIcon from '../forms/helpicon';
import ContentContainer from '../layout/ContentContainer';

const roomToolTip: Record<string, string> = {
    [Room.All]: "Any time a skill would spawn, it will try to grab one from here instead.",
    [Room.Free]: "Skills for anywhere you don't have to pay anything - the default skill room, pedestals, even the final boss fight.",
    [Room.Shop]: "Skills available in the shop will be selected from here, including for the Ray reroll and Tappi restock.",
    [Room.Curse]: "This decides what skill is rewarded for taking the curse in the curse room. Remember there is a chance to spawn mutliple skills.",
    [Room.Finale]: "This decides what skill comes out of the cube for completing the end of floor battle, if it would drop one.",
}

function getRoomTooltip(room: Room): ReactNode {
    const tooltip = roomToolTip[room];
    return tooltip ? <Flex alignItems="center" gap={2} ml={-2}>
        <HelpIcon tooltip={tooltip} placement="left" size="sm" />
        {capitalise(room)}
    </Flex> : capitalise(room);
}

const FloorConfigTab = ({ selectedMod, floor }: { selectedMod: ModConfig; floor: Floor }) => {
    const dispatch = useDispatch();

    const renderDropzone = useCallback(
        (room: Room, singleRow: boolean) => {
            return (
                <LabelledDropzone
                    key={room}
                    singleRow={singleRow}
                    rotateLabel={singleRow}
                    skills={selectedMod.floorSkills[floor][room]}
                    label={getRoomTooltip(room)}
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
            return [Room.Free, Room.Shop, Room.Curse, Room.Finale].map((room) => renderDropzone(room, true));
        }

        return renderDropzone(Room.All, false);
    }, [selectedMod.general, selectedMod.floorSkills[floor]]);

    return <ContentContainer>{renderDropzones()}</ContentContainer>;
};

export default FloorConfigTab;
