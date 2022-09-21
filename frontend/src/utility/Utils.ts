export function allValues<T extends {}>(anEnum: T): T[keyof T][] {
    return Object.values(anEnum) as unknown as T[keyof T][];
}

export function capitalise(str: string): string {
    return str.slice(0, 1).toLocaleUpperCase() + str.slice(1);
}
