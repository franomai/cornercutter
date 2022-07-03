export function convertKeysToSnakeCase(obj: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};
    Object.keys(obj).forEach((key) => {
        const snakeCaseKey = key.replace(/([a-z])([A-Z])/g, '$1_$2').toLocaleLowerCase();
        result[snakeCaseKey] = obj[key];
    });

    return result;
}
