import HelpIcon from '../forms/HelpIcon';
import Dropzone, { DropzoneProps } from './Dropzone';

import { ReactNode, useCallback } from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Box, Flex, IconButton, Stack } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface LabelledDropzoneProps extends DropzoneProps {
    label: ReactNode;
    rotateLabel?: boolean;
    tooltip?: string;
}

export default function LabelledDropzone({
    label,
    handleSetSkills,
    rotateLabel,
    tooltip,
    ...dropzoneProps
}: LabelledDropzoneProps) {
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
                        {!tooltip || <HelpIcon tooltip={tooltip} size="sm" />}
                        <Box fontSize="2xl" fontWeight="bold">
                            {label}
                        </Box>
                        <IconButton
                            variant="ghost"
                            title="Clear all skills"
                            aria-label="Clear all skills"
                            onClick={() => handleSetSkills([])}
                            icon={<FontAwesomeIcon icon={faTrash} />}
                        />
                    </Flex>
                </Box>
            );
        return (
            <Flex direction="row" gap={2} alignItems="center">
                {!tooltip || <HelpIcon tooltip={tooltip} size="sm" />}
                <Box fontSize="2xl" fontWeight="bold">
                    {label}
                </Box>
                <IconButton
                    variant="ghost"
                    title="Clear all skills"
                    aria-label="Clear all skills"
                    onClick={() => handleSetSkills([])}
                    icon={<FontAwesomeIcon icon={faTrash} />}
                />
            </Flex>
        );
    }, [label, tooltip, rotateLabel, handleSetSkills]);

    return (
        <Stack spacing={6} height="full" w="full" direction={rotateLabel ? 'row' : 'column'} userSelect="none">
            {renderLabel()}
            <Dropzone handleSetSkills={handleSetSkills} {...dropzoneProps} />
        </Stack>
    );
}
