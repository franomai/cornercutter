import { Box, Stack } from '@chakra-ui/react';
import { ReactNode } from 'react';

const ContentContainer = ({ children }: { children?: ReactNode }) => {
    return (
        <Box maxW="full" w="full" maxH="calc(100% - 72px)" h="full" px="72px" py="64px" overflowX="hidden">
            {children}
        </Box>
    );
};

export default ContentContainer;
