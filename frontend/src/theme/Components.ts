import { ComponentStyleConfig } from '@chakra-ui/react';
import { asCssVar, ThemeColours } from './ThemeUtils';

export type ComponentStyleBuilder = (theme: ThemeColours) => ComponentStyleConfig;

export const Checkbox: ComponentStyleBuilder = (theme) => ({
    baseStyle: {
        control: {
            _focusVisible: {
                boxShadow: `0 0 0 3px ${asCssVar(theme.primary.light)}`,
            },
            _checked: {
                bg: 'primary.main',
                borderColor: 'primary.main',
                color: 'bg.main',
                _hover: {
                    bg: 'primary.dark',
                    borderColor: 'primary.dark',
                },
            },
        },
    },
});

export const Radio: ComponentStyleBuilder = (theme) => ({
    baseStyle: {
        control: {
            _focusVisible: {
                boxShadow: `0 0 0 3px ${asCssVar(theme.primary.main)}`,
            },
            _checked: {
                bg: 'primary.main',
                borderColor: 'primary.main',
                color: 'bg.main',
                _hover: {
                    bg: 'primary.dark',
                    borderColor: 'primary.dark',
                },
            },
        },
    },
});

export const Tabs: ComponentStyleConfig = {
    variants: {
        line: {
            tab: {
                _selected: {
                    color: 'primary.main',
                },
            },
        },
    },
};

export const Input: ComponentStyleConfig = {
    variants: {
        filled: {
            field: {
                background: 'bg.main',
                _focusVisible: {
                    background: 'bg.light',
                    borderColor: 'none',
                },
                _hover: {
                    background: 'bg.light',
                },
            },
        },
    },
};
