export function allValues<T extends {}>(anEnum: T): T[keyof T][] {
    return Object.values(anEnum) as unknown as T[keyof T][];
}

export function capitalise(str: string): string {
    return str.slice(0, 1).toLocaleUpperCase() + str.slice(1);
}

const ONE_SECOND = 1_000;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;

export function getRelativeTimeSince(time: number): string {
    const relativeTime = Date.now() - time;

    if (relativeTime < 5 * ONE_SECOND) {
        return 'just now';
    } else if (relativeTime < ONE_MINUTE) {
        return 'a few seconds ago';
    } else if (relativeTime < 5 * ONE_MINUTE) {
        return 'a few minutes ago';
    } else if (relativeTime < ONE_HOUR) {
        return `${Math.floor(relativeTime / ONE_MINUTE)} minutes ago`;
    } else if (relativeTime < ONE_DAY) {
        return `${Math.floor(relativeTime / ONE_HOUR)} hours ago`;
    }
    return `on ${new Date(time).toLocaleDateString()}`;
}
