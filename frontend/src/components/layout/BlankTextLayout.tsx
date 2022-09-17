import { Stack, Text } from '@chakra-ui/react';

const BlankTextLayout = ({ title, subtitle }: { title: string; subtitle: string }) => {
    return (
        <Stack
            w="full"
            h="full"
            color="gray.600"
            alignItems="center"
            justifyContent="center"
            spacing={0}
            userSelect="none"
        >
            <Text fontSize="5xl" fontWeight="bold" lineHeight={1}>
                {title}
            </Text>
            <Text fontSize="xl" fontWeight="semibold">
                {subtitle}
            </Text>
        </Stack>
    );
};

export default BlankTextLayout;
