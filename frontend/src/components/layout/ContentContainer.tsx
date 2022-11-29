import { ReactNode } from 'react';
import { Stack, StackProps } from '@chakra-ui/react';

interface ContentContainerProps extends StackProps {
    children?: ReactNode;
}

export default function ContentContainer({ children, ...stackProps }: ContentContainerProps) {
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
}
