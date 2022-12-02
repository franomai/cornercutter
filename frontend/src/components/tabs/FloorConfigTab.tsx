import HelpIcon from '../forms/HelpIcon';
import ModConfig from '../../types/Configuration';
import ContentContainer from '../layout/ContentContainer';
import LabelledDropzone from '../dropzone/LabelledDropzone';

import { Flex } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { ReactNode, useCallback } from 'react';
import { capitalise } from '../../utility/Utils';
import { setFloorSkills } from '../../redux/slices/mod';
import { hasOptionSet } from '../../utility/ConfigHelpers';
import { ModOptions, Floor, Room } from '../../types/enums/ConfigEnums';
import useSavingContext from '../../contexts/SavingContext';

interface FloorConfigTabProps {
    selectedMod: ModConfig;
    floor: Floor;
}

const roomTooltips: Record<string, string> = {
    [Room.All]: 'Any time a skill would spawn, it will try to grab one from here instead.',
    [Room.Free]:
        "Skills for anywhere you don't have to pay anything - the default skill room, pedestals, even the final boss fight.",
    [Room.Shop]:
        'Skills available in the shop will be selected from here, including for the Ray reroll and Tappi restock.',
    [Room.Curse]:
        'This decides what skill is rewarded for taking the curse in the curse room. Remember there is a chance to spawn mutliple skills.',
    [Room.Finale]:
        'This decides what skill comes out of the cube for completing the end of floor battle, if it would drop one.',
};

export default function FloorConfigTab({ selectedMod, floor }: FloorConfigTabProps) {
    const dispatch = useDispatch();
    const { saveSelectedMod } = useSavingContext();

    const renderRoomLabel = useCallback((room: Room) => {
        if (room === Room.All) return 'All Rooms';
        return capitalise(room);
    }, []);

    const renderRoomTooltip = useCallback(
        (room: Room): ReactNode => {
            const tooltip = roomTooltips[room];
            return tooltip ? (
                <Flex alignItems="center" gap={2} ml={-2}>
                    <HelpIcon tooltip={tooltip} placement="left" size="sm" />
                    {renderRoomLabel(room)}
                </Flex>
            ) : (
                renderRoomLabel(room)
            );
        },
        [renderRoomLabel],
    );

    const renderDropzone = useCallback(
        (room: Room, singleRow: boolean) => {
            return (
                <LabelledDropzone
                    key={room}
                    singleRow={singleRow}
                    rotateLabel={singleRow}
                    skills={selectedMod.floorSkills[floor][room]}
                    label={renderRoomTooltip(room)}
                    handleSetSkills={(skills) => {
                        dispatch(setFloorSkills({ floor, room, skills }));
                        saveSelectedMod();
                    }}
                />
            );
        },
        [floor, selectedMod.floorSkills, dispatch, renderRoomTooltip, saveSelectedMod],
    );

    const renderDropzones = useCallback((): ReactNode => {
        if (hasOptionSet(selectedMod.general.options, ModOptions.ConfigPerRoom)) {
            return [Room.Free, Room.Shop, Room.Curse, Room.Finale].map((room) => renderDropzone(room, true));
        }

        return renderDropzone(Room.All, false);
    }, [selectedMod.general, renderDropzone]);

    return <ContentContainer>{renderDropzones()}</ContentContainer>;
}
