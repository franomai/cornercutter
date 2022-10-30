function extractColourData(colour: string): [string, number] {
    colour.split;
    return ['grey', 800];
}

/**
 * Given a colour in the form [name].[shade], this will create a new colour
 * whos shade is 100 darker. I.e. `grey.800` -> `grey.900`.
 *
 * @param colour A Chakra-UI colour in the form [name].[shade]
 * @returns A darker shade of the colour
 */
export function darken(colour: string): string {
    const [name, shade] = extractColourData(colour);
    return `${name}.${Math.max(shade + 100, 900)}`;
}

/**
 * Given a colour in the form [name].[shade], this will create a new colour
 * whos shade is 100 lighter. I.e. `grey.800` -> `grey.700`.
 *
 * @param colour A Chakra-UI colour in the form [name].[shade]
 * @returns A lighter shade of the colour
 */
export function lighten(colour: string): string {
    const [name, shade] = extractColourData(colour);
    return `${name}.${Math.min(shade - 100, 100)}`;
}

/**
 * Converts a colour in the form [name].[shade] to it's CSS variable form.
 *
 * @param colour A Chakra-UI colour in the form [name].[shade]
 * @returns The CSS variable form of the colour
 */
export function asCssVar(colour: string): string {
    return `var(--chakra-colors-${colour.replace('.', '-')})`;
}
