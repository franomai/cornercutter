import { Flex, IconButton, Stack, Text } from '@chakra-ui/react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dropzone, { DropzoneProps } from './Dropzone';

const LabelledDropzone = ({
    label,
    handleClearAllSkills,
    ...dropzoneProps
}: {
    label: string;
    handleClearAllSkills(): void;
} & DropzoneProps) => {
    return (
        <Stack spacing={6} height="full">
            <Flex direction="row" gap={2} alignItems="center">
                <Text fontSize="2xl" fontWeight="bold">
                    {label}
                </Text>
                <IconButton
                    variant="ghost"
                    title="Clear all skills"
                    aria-label="Clear all skills"
                    onClick={() => handleClearAllSkills()}
                    icon={<FontAwesomeIcon icon={faTrash} />}
                />
            </Flex>
            <Dropzone {...dropzoneProps} />
        </Stack>
    );
};

export default LabelledDropzone;
