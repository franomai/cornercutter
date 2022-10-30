import { extendTheme } from '@chakra-ui/react';
import { ThemeColours } from './ThemeUtils';
import { styles, config } from './Styles';
import { Checkbox, Radio, Tabs, Input } from './Components';
import { Dict } from '@chakra-ui/utils';

const createTheme = (theme: ThemeColours): Dict =>
    extendTheme({
        styles: styles(theme),
        config,
        components: {
            Checkbox: Checkbox(theme),
            Radio: Radio(theme),
            Tabs: Tabs(theme),
            Input: Input(theme),
        },
    });

export default createTheme;
