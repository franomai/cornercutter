import { Button, Center, Flex, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import ModConfig, { DEFAULT_CONFIG } from '../../../types/Configuration';
import { generateEmptyFloorSkills } from '../../../utility/ConfigHelpers';
import ContentContainer from '../../layout/ContentContainer';

const NewMod = ({
    id,
    handleCreate,
    handleDiscard,
}: {
    id: string;
    handleDiscard(): void;
    handleCreate(mod: ModConfig): void;
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const canSave = name.trim().length !== 0;

    const handleCreateMod = useCallback(() => {
        handleCreate({
            id,
            info: { name, description },
            general: DEFAULT_CONFIG,
            floorSkills: generateEmptyFloorSkills(),
        });
    }, [id, handleCreate, name, description]);

    return (
        <ContentContainer>
            <FormControl isRequired>
                <Input placeholder="Mod name..." value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl>
                <Input
                    placeholder="Mod description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </FormControl>
            <Flex direction="row" gap={2}>
                <Button onClick={handleDiscard}>Discard Mod</Button>
                <Button onClick={handleCreateMod} isDisabled={!canSave}>
                    Create Mod
                </Button>
            </Flex>
        </ContentContainer>
    );
};
