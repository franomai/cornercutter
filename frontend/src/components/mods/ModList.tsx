import { Stack } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { getAllMods, getEnabledMod, getSelectedMod } from '../../redux/slices/mod';
import ModOverview from './ModOverview';

const ModList = ({ children }: { children?: ReactNode }) => {
    const mods = useSelector(getAllMods);
    const enabledMod = useSelector(getEnabledMod);
    const selectedMod = useSelector(getSelectedMod);

    return (
        <Stack
            maxW="240px"
            minW="240px"
            p={4}
            h="full"
            background="blackAlpha.300"
            overflow="hidden"
            justifyContent="space-between"
        >
            <Stack gap={2} h="full">
                {Object.values(mods).map((mod) => (
                    <ModOverview
                        key={mod.id}
                        mod={mod}
                        isEnabled={mod.id === enabledMod?.id}
                        isSelected={mod.id === selectedMod?.id}
                    />
                ))}
            </Stack>
            {children}
        </Stack>
    );
};

export default ModList;
