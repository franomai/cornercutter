import { Stack, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { SkillSearchColumn } from '../searchbar';
import ContentContainer from './ContentContainer';

const SideSearchColumnLayout = ({ children }: { children?: ReactNode }) => {
    return (
        <Stack direction="row" minH="full" maxH="full" minW="full" maxW="full" overflow="hidden">
            <ContentContainer>{children}</ContentContainer>
            <SkillSearchColumn />
        </Stack>
    );
};

export default SideSearchColumnLayout;
