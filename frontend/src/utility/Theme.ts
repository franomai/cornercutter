import { ComponentStyleConfig, extendTheme, ThemeConfig } from '@chakra-ui/react';
import { Styles } from '@chakra-ui/theme-tools';

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};

const styles: Styles = {
    global: {
        body: {
            bg: 'gray.800',
        },
    },
};

const Checkbox: ComponentStyleConfig = {
    baseStyle: {
        control: {
            _focusVisible: {
                boxShadow: '0 0 0 3px var(--chakra-colors-green-200)',
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

const Radio: ComponentStyleConfig = {
    baseStyle: {
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

const Tabs: ComponentStyleConfig = {
    variants: {
        line: {
            tab: {
                _selected: {
                    color: 'green.300',
                },
            },
        },
    },
};

const Input: ComponentStyleConfig = {
    variants: {
        filled: {
            field: {
                _focusVisible: {
                    borderColor: 'none',
                },
            },
        },
    },
};

const theme = extendTheme({
    styles,
    config,
    components: {
        Checkbox,
        Radio,
        Tabs,
        Input,
    },
});

export default theme;
