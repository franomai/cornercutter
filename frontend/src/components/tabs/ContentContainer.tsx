import { Box, Stack } from '@chakra-ui/react';
import { ReactNode } from 'react';

const ContentContainer = ({ children }: { children?: ReactNode }) => {
    return (
        <Box maxW="full" w="full" maxH="100%" h="full" mb="8px" mt="32px" overflow="hidden">
            <Stack overflowY="auto" maxH="calc(100% - 87px)" px="72px" pb="56px" pt="32px" spacing={8}>
                {children}
            </Stack>
        </Box>
    );
};

export default ContentContainer;
