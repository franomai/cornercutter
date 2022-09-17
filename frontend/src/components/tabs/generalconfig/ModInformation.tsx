import { Flex, IconButton, Stack, Text } from '@chakra-ui/react';
import { faArrowUpFromBracket, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import ModConfig from '../../../types/Configuration';

const ModInformation = ({ selectedMod }: { selectedMod: ModConfig }) => {
    function renderActionButtons(): ReactNode {
        return (
            <Stack direction="row" spacing={1.5}>
                <IconButton
                    variant="ghost"
                    title="Export mod config code"
                    aria-label="Export mod config code"
                    icon={<FontAwesomeIcon icon={faArrowUpFromBracket} size="lg" />}
                />
                <IconButton
                    variant="ghost"
                    title="Edit mod config name and description"
                    aria-label="Edit mod config name and description"
                    icon={<FontAwesomeIcon icon={faPenToSquare} size="lg" />}
                />
                <IconButton
                    variant="ghost"
                    title="Delete mod"
                    aria-label="Delete mod"
                    icon={<FontAwesomeIcon icon={faTrash} size="lg" />}
                />
            </Stack>
        );
    }

    return (
        <Stack spacing={2}>
            <Flex direction="row" justifyContent="space-between">
                <Text fontSize="3xl" fontWeight="bold">
                    {selectedMod.info.name}
                </Text>
                {renderActionButtons()}
            </Flex>
            <Text>{selectedMod.info.description}</Text>
        </Stack>
    );
};

export default ModInformation;
