import { Stack, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { DEFAULT_CONFIG } from '../../types/Configuration';
import ModOverview from './ModOverview';

const ModList: FC = () => {
    return (
        <Stack w={60} p={8} gap={2} h="full" background="blackAlpha.300">
            {Array(10)
                .fill(0)
                .map((_, index) => (
                    <ModOverview
                        key={index}
                        mod={{ id: index, info: { name: `Mod ${index}`, description: '' }, general: DEFAULT_CONFIG }}
                        isSelected={index === 0}
                    />
                ))}
        </Stack>
    );
};

export default ModList;
