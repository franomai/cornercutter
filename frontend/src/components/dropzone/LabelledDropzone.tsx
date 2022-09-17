import { Box, Flex, IconButton, Stack, Text } from '@chakra-ui/react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useCallback } from 'react';
import Dropzone, { DropzoneProps } from './Dropzone';

const LabelledDropzone = ({
    label,
    handleClearAllSkills,
    rotateLabel,
    ...dropzoneProps
}: {
    label: ReactNode;
    rotateLabel?: boolean;
    handleClearAllSkills(): void;
} & DropzoneProps) => {
    const renderLabel = useCallback(() => {
        if (rotateLabel)
            return (
                <Box position="relative" h="full" maxW="40px" minW="40px">
                    <Flex
                        h="full"
                        w="full"
                        mt={5}
                        position="absolute"
                        direction="row"
                        gap={2}
                        alignItems="center"
                        style={{ transform: 'rotate(-90deg)' }}
                    >
                        <Text as={Box} fontSize="2xl" fontWeight="bold">
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
                </Box>
            );
        return (
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
        );
    }, [label, handleClearAllSkills, rotateLabel]);

    return (
        <Stack spacing={6} height="full" w="full" direction={rotateLabel ? 'row' : 'column'} userSelect="none">
            {renderLabel()}
            <Dropzone {...dropzoneProps} />
        </Stack>
    );
};

export default LabelledDropzone;
