import { ReactNode } from 'react';
import { Box, Flex, ScaleFade, Text, Tooltip } from '@chakra-ui/react';

interface SavingMessageProps {
    hasError?: boolean;
    message: ReactNode;
    tooltip?: string | null;
    icon: ReactNode;
}

export default function SavingMessage({ hasError, message, tooltip, icon }: SavingMessageProps) {
    return (
        <Flex
            h="full"
            w="full"
            bg="blackAlpha.200"
            borderBottomWidth={2}
            justifyContent="end"
            alignItems="center"
            flexDirection="row"
            pr={4}
            gap={2}
        >
            <Text fontSize="sm" color="gray.600" textAlign="right" fontWeight="semibold" display="inline-flex">
                {message}
            </Text>
            <ScaleFade initialScale={0.8} in={true}>
                <Box w={4} color={hasError ? 'red.400' : 'green.300'}>
                    <Tooltip hasArrow label={tooltip} bg={hasError ? 'red.400' : undefined}>
                        <span>{icon}</span>
                    </Tooltip>
                </Box>
            </ScaleFade>
        </Flex>
    );
}
