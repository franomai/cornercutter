export function convertKeysToSnakeCase(obj: any): any {
    if (!isObject(obj)) return obj;

    const result: Record<string, any> = {};

    Object.keys(obj).forEach((key) => {
        const snakeCaseKey = key.replace(/([a-z])([A-Z])/g, '$1_$2').toLocaleLowerCase();
        result[snakeCaseKey] = convertKeysToSnakeCase(obj[key]);
    });

    return result;
}

export function isObject(obj: unknown): obj is Record<string, unknown> {
    return typeof obj === 'object' && !Array.isArray(obj);
}

export function allValues<T extends {}>(anEnum: T): T[keyof T][] {
    return Object.values(anEnum) as unknown as T[keyof T][];
}
