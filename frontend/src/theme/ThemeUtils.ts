import { ColorProps, ResponsiveValue, ThemeTypings } from '@chakra-ui/react';

export interface ColourVariants {
    main: string;
    light: string;
    dark: string;
}

export interface ThemeColours {
    bg: ColourVariants;
    primary: ColourVariants;
}

type Colours = ThemeTypings['colors'];

/**
 * Given a colour of the form [name].[shade] or [name], it splits it into a
 * tuple [name, shade] or [name, 100] respectively.
 *
 * @param colour The Chakra-UI colour in the form [name].[shade]
 * @returns The parsed name and shade
 */
function extractColourData(colour: string): [string, number] {
    const splitColour = colour.split('.', 2);
    if (splitColour.length == 2) {
        return [splitColour[0], Number.parseInt(splitColour[1])];
    }
    return [colour, 100];
}

/**
 * Given a colour in the form [name].[shade], this will create a new colour
 * with a shade is 100 darker. I.e. `grey.800` -> `grey.900`.
 *
 * @param colour A Chakra-UI colour in the form [name].[shade]
 * @returns A darker shade of the colour
 */
export function darken(colour: Colours): string {
    const [name, shade] = extractColourData(colour);
    return `${name}.${Math.min(shade + 100, 900)}`;
}

/**
 * Given a colour in the form [name].[shade], this will create a new colour
 * with a shade is 100 lighter. I.e. `grey.800` -> `grey.700`.
 *
 * @param colour A Chakra-UI colour in the form [name].[shade]
 * @returns A lighter shade of the colour
 */
export function lighten(colour: Colours): string {
    const [name, shade] = extractColourData(colour);
    return `${name}.${Math.max(shade - 100, 50)}`;
}

/**
 * Converts a colour in the form [name].[shade] to it's CSS variable form.
 *
 * @param colour A Chakra-UI colour in the form [name].[shade]
 * @returns The CSS variable form of the colour
 */
export function asCssVar(colour: Colours): string {
    return `var(--chakra-colors-${colour.replace('.', '-')})`;
}

export function createVariants(main: string): ColourVariants {
    return {
        main,
        light: lighten(main),
        dark: darken(main),
    };
}
