import { Checkbox, Stack, Text } from '@chakra-ui/react';

import ModConfig from '../../types/Configuration';

const ModOverview = ({ mod, isSelected }: { mod: ModConfig; isSelected: boolean }) => {
    return (
        <Stack
            direction="row"
            px={4}
            py={2}
            background="gray.800"
            borderRadius={6}
            justifyContent="space-between"
            alignItems="center"
            gap={2}
        >
            <Text
                sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
                fontSize="md"
                fontWeight="semibold"
                color={isSelected ? 'green.300' : 'white'}
            >
                {mod.info.name}
            </Text>
            <Checkbox isChecked={isSelected} size="lg" />
        </Stack>
    );
};

export default ModOverview;
