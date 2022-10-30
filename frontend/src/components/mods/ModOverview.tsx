import { Checkbox, Stack, Text } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { updateEnabledMod, setSelectedMod } from '../../redux/slices/mod';
import { getColours } from '../../redux/slices/theme';
import { AppDispatch } from '../../redux/store';
import { asCssVar } from '../../theme/ThemeUtils';

import ModConfig from '../../types/Configuration';

const ModOverview = ({ mod, isEnabled, isSelected }: { mod: ModConfig; isEnabled: boolean; isSelected: boolean }) => {
    const dispatch = useDispatch<AppDispatch>();
    const colours = useSelector(getColours);

    const handleEnable = () => {
        dispatch(updateEnabledMod(isEnabled ? null : mod.id));
    };

    const handleSelect = () => {
        dispatch(setSelectedMod(mod.id));
    };

    return (
        <Stack
            direction="row"
            px={4}
            py={2}
            background={colours.bg.main}
            borderRadius={6}
            justifyContent="space-between"
            alignItems="center"
            gap={2}
            onClick={handleSelect}
            boxShadow={isSelected ? `0 0 0 2px ${asCssVar(colours.primary.main)}` : undefined}
            _hover={{ boxShadow: isSelected ? undefined : `0 0 0 2px ${asCssVar(colours.primary.light)}` }}
        >
            <Text
                sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
                fontSize="md"
                fontWeight="semibold"
                color={isEnabled ? colours.primary.main : 'white'}
            >
                {mod.info.name}
            </Text>
            <Checkbox isChecked={isEnabled} size="lg" onChange={handleEnable} />
        </Stack>
    );
};

export default ModOverview;
