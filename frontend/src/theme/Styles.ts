import { Colors, ThemeConfig } from '@chakra-ui/react';
import { Styles } from '@chakra-ui/theme-tools';
import { ThemeColours } from './ThemeUtils';

export const config: ThemeConfig = {
    useSystemColorMode: false,
};

export const styles: Styles = {
    global: {
        body: {
            bg: 'bg.main',
        },
    },
};
