import { Stack, Text } from '@chakra-ui/react';

interface BlankTextLayoutProps {
    title: string;
    subtitle: string;
}

export default function BlankTextLayout({ title, subtitle }: BlankTextLayoutProps) {
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
}
