import { Box, Stack } from '@chakra-ui/react';
import { ReactNode } from 'react';

const ContentContainer = ({ children }: { children?: ReactNode }) => {
    return (
        <Box w="full" h="full" px="72px" py="64px">
            {children}
        </Box>
    );
};

export default ContentContainer;
