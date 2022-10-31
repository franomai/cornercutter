import { extendTheme } from '@chakra-ui/react';
import { asCssVar, ThemeColours } from './ThemeUtils';
import { styles, config } from './Styles';
import { Checkbox, Radio, Tabs, Input } from './Components';
import { Dict } from '@chakra-ui/utils';

const createTheme = (theme: ThemeColours): Dict =>
    extendTheme({
        styles,
        colors: {
            bg: {
                main: asCssVar(theme.bg.main),
                light: asCssVar(theme.bg.light),
                dark: asCssVar(theme.bg.dark),
            },
            primary: {
                main: asCssVar(theme.primary.main),
                light: asCssVar(theme.primary.light),
                dark: asCssVar(theme.primary.dark),
            },
        },
        config,
        components: {
            Checkbox: Checkbox(theme),
            Radio: Radio(theme),
            Tabs,
            Input,
        },
    });

export default createTheme;
