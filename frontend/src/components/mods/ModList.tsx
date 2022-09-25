import { Button, Stack } from '@chakra-ui/react';
import { invoke } from '@tauri-apps/api/tauri';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMod, getAllMods, getEnabledMod, getSelectedMod } from '../../redux/slices/mod';
import { generateEmptyMod } from '../../utility/ConfigHelpers';
import ModOverview from './ModOverview';

const ModList = () => {
    const dispatch = useDispatch();
    const mods = useSelector(getAllMods);
    const enabledMod = useSelector(getEnabledMod);
    const selectedMod = useSelector(getSelectedMod);

    const handleNewMod = useCallback(() => {
        invoke('get_new_mod_id')
            .then((id) => dispatch(addMod(generateEmptyMod(id as string))))
            .catch(console.error);
    }, [selectedMod]);

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
            <Button variant="outline" w="full" onClick={handleNewMod}>
                New Mod
            </Button>
        </Stack>
    );
};

export default ModList;
