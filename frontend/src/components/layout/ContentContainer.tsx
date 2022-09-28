import { Box, Stack, StackProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

const ContentContainer = ({ children, ...stackProps }: { children?: ReactNode } & StackProps) => {
    return (
        <Stack
            flexGrow={1}
            overflowY="auto"
            maxW="full"
            maxH="full"
            minH="full"
            px="72px"
            mb={2}
            pb="56px"
            mt={8}
            pt={8}
            spacing={8}
            style={{ scrollbarGutter: 'stable' }}
            {...stackProps}
        >
            {children}
        </Stack>
    );
};

export default ContentContainer;
