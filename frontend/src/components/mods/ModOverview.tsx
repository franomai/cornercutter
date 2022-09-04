import { Checkbox, Stack, Text } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { setCurrentMod } from '../../redux/slices/mod';

import ModConfig from '../../types/Configuration';

const ModOverview = ({ mod, isSelected }: { mod: ModConfig; isSelected: boolean }) => {
    const dispatch = useDispatch();

    const handleSelect = () => {
        dispatch(setCurrentMod(isSelected ? -1 : mod.id));
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
        >
            <Text
                sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
                fontSize="md"
                fontWeight="semibold"
                color={isSelected ? 'green.300' : 'white'}
            >
                {mod.info.name}
            </Text>
            <Checkbox isChecked={isSelected} size="lg" onChange={handleSelect} />
        </Stack>
    );
};

export default ModOverview;
