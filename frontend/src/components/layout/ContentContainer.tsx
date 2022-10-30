import { Box, Stack, StackProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

const ContentContainer = ({ children, ...stackProps }: { children?: ReactNode } & StackProps) => {
    return (
        <Stack
            flexGrow={1}
            overflowY="auto"
            maxW="full"
            minW="full"
            w="full"
            maxH="full"
            minH="full"
            h="full"
            px={{ base: '24px', '2xl': '72px' }}
            mb={2}
            pb="56px"
            mt={8}
            pt={{ base: 0, '2xl': 8 }}
            spacing={8}
            style={{ scrollbarGutter: 'stable' }}
            {...stackProps}
        >
            {children}
        </Stack>
    );
};

export default ContentContainer;
