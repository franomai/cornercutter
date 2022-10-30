import { ThemeConfig } from '@chakra-ui/react';
import { Styles } from '@chakra-ui/theme-tools';
import { ThemeColours } from './ThemeUtils';

export const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};

export const styles = (theme: ThemeColours): Styles => ({
    global: {
        body: {
            bg: theme.bg,
        },
    },
});
