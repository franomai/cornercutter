import { Checkbox, Stack, Text } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { setEnabledMod, setSelectedMod } from '../../redux/slices/mod';

import ModConfig from '../../types/Configuration';

const ModOverview = ({ mod, isEnabled }: { mod: ModConfig; isEnabled: boolean }) => {
    const dispatch = useDispatch();

    const handleEnable = () => {
        dispatch(setEnabledMod(isEnabled ? -1 : mod.id));
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
            boxShadow={`0 0 0 2px var(--chakra-colors-green-300)`}
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
};

export default ModOverview;
