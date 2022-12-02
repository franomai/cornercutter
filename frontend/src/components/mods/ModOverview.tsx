import ModConfig from '../../types/Configuration';

import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { Checkbox, Stack, Text } from '@chakra-ui/react';
import { updateEnabledMod, setSelectedMod } from '../../redux/slices/mod';

interface ModOverviewProps {
    mod: ModConfig;
    isEnabled: boolean;
    isSelected: boolean;
}

export default function ModOverview({ mod, isEnabled, isSelected }: ModOverviewProps) {
    const dispatch = useDispatch<AppDispatch>();

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
            background="gray.800"
            borderRadius={6}
            justifyContent="space-between"
            alignItems="center"
            gap={2}
            onClick={handleSelect}
            boxShadow={isSelected ? `0 0 0 2px var(--chakra-colors-green-300)` : undefined}
            _hover={{ boxShadow: isSelected ? undefined : `0 0 0 2px var(--chakra-colors-green-200)` }}
        >
            <Text
                sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
                fontSize="md"
                fontWeight="semibold"
                color={isEnabled ? 'green.300' : 'white'}
            >
                {mod.info.name}
            </Text>
            <Checkbox isChecked={isEnabled} size="lg" onChange={handleEnable} />
        </Stack>
    );
}
