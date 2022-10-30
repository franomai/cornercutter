import { ComponentStyleConfig } from '@chakra-ui/react';
import { asCssVar } from './Utils';

export interface ThemeColourings {
    bg: string;
    primary: {
        main: string;
        light: string;
        dark: string;
    };
}

export type ComponentStyleBuilder = (theme: ThemeColourings) => ComponentStyleConfig;

export const Checkbox: ComponentStyleBuilder = (theme) => ({
    baseStyle: {
        control: {
            _focusVisible: {
                boxShadow: `0 0 0 3px ${asCssVar(theme.primary.light)}`,
            },
            _checked: {
                bg: theme.primary.main,
                borderColor: theme.primary.main,

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
