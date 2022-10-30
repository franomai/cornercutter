import { ComponentStyleConfig } from '@chakra-ui/react';
import { asCssVar, darken, ThemeColours } from './ThemeUtils';

export type ComponentStyleBuilder = (theme: ThemeColours) => ComponentStyleConfig;

export const Checkbox: ComponentStyleBuilder = (theme) => ({
    baseStyle: {
        control: {
            _focusVisible: {
                boxShadow: `0 0 0 3px ${asCssVar(theme.primary.light)}`,
            },
            _checked: {
                bg: theme.primary.main,
                borderColor: theme.primary.main,
                color: theme.bg.main,
                _hover: {
                    bg: theme.primary.dark,
                    borderColor: theme.primary.dark,
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
                bg: theme.primary.main,
                borderColor: theme.primary.main,
                color: theme.bg.main,
                _hover: {
                    bg: theme.primary.dark,
                    borderColor: theme.primary.dark,
                },
            },
        },
    },
});

export const Tabs: ComponentStyleBuilder = (theme) => ({
    variants: {
        line: {
            tab: {
                _selected: {
                    color: theme.primary.main,
                },
            },
        },
    },
});

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
