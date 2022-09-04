import { ComponentStyleConfig, extendTheme, ThemeConfig, withDefaultColorScheme } from '@chakra-ui/react';

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};

const Checkbox: ComponentStyleConfig = {
    baseStyle: {
        borderColor: 'green.300',
        control: {
            _focusVisible: {
                boxShadow: '0 0 0 3px var(--chakra-colors-green-300)',
            },
            _checked: {
                bg: 'green.300',
                borderColor: 'green.300',

                _hover: {
                    bg: 'green.400',
                    borderColor: 'green.400',
                },
            },
        },
    },
};

const theme = extendTheme({
    config,
    components: {
        Checkbox,
    },
});

export default theme;
