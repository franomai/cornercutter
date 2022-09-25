import { Button, Center, Flex, FormControl, FormLabel, Input, Stack, Textarea } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import ModConfig, { DEFAULT_CONFIG } from '../../types/Configuration';
import { generateEmptyFloorSkills } from '../../utility/ConfigHelpers';
import ContentContainer from '../layout/ContentContainer';

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
        <ContentContainer alignItems="center">
            <Stack spacing={4} w="500px" bg="blackAlpha.200" px={8} py={6} rounded="md">
                <FormControl isRequired>
                    <FormLabel>Mod Name</FormLabel>
                    <Input
                        variant="flushed"
                        placeholder="Mod name..."
                        value={name}
                        fontSize="3xl"
                        fontWeight="bold"
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <Textarea
                        variant="flushed"
                        placeholder="Mod description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </FormControl>
                <Flex direction="row" gap={2}>
                    <Button onClick={handleDiscard} variant="outline">
                        Discard Mod
                    </Button>
                    <Button onClick={handleCreateMod} isDisabled={!canSave}>
                        Create Mod
                    </Button>
                </Flex>
            </Stack>
        </ContentContainer>
    );
};

export default NewMod;
