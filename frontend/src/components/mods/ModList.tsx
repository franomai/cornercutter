import { Stack } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { getAllMods, getEnabledMod } from '../../redux/slices/mod';
import ModOverview from './ModOverview';

const ModList = () => {
    const mods = useSelector(getAllMods);
    const enabledMod = useSelector(getEnabledMod);

    return (
        <Stack maxW="280px" w="280px" p={4} gap={2} h="full" background="blackAlpha.300" overflow="hidden">
            {mods.map((mod) => (
                <ModOverview key={mod.id} mod={mod} isEnabled={mod.id === enabledMod?.id} />
            ))}
        </Stack>
    );
};

export default ModList;
