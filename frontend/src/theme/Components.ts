import { ComponentStyleConfig } from '@chakra-ui/react';
import { ThemeState } from '../redux/slices/theme';

export type ComponentStyleBuilder = (theme: ThemeState) => ComponentStyleConfig;

export const Checkbox: ComponentStyleBuilder = (theme) => ({
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
});

export const Radio: ComponentStyleConfig = {
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

export const Tabs: ComponentStyleConfig = {
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

export const Input: ComponentStyleConfig = {
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
