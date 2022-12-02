import { ComponentStyleConfig, extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};

const Link: ComponentStyleConfig = {
    baseStyle: {
        color: 'green.300',
    },
};

const Button: ComponentStyleConfig = {
    baseStyle: {
        _focusVisible: {
            boxShadow: '0 0 0 3px var(--chakra-colors-green-300)',
        },
    },
    variants: {
        primary: {
            bg: 'green.300',
            _hover: {
                bg: 'green.400',
            },
            _disabled: {
                _hover: {
                    // For some reason there's a default style that's a higher priority
                    // than this hence the !important is needed to override it.
                    bg: 'green.300 !important',
                },
            },
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
        flushed: {
            field: {
                _focusVisible: {
                    borderColor: 'green.300',
                    boxShadow: `0px 1px 0px 0px var(--chakra-colors-green-300)`,
                },
            },
        },
    },
};

const theme = extendTheme({
    config,
    components: {
        Checkbox,
        Radio,
        Tabs,
        Input,
        Button,
        Link,
    },
});

export default theme;
