export default interface Configuration {
    disableHp: boolean;
    disableOtherDrops: boolean;
}

export const DEFAULT_CONFIG: Configuration = {
    disableHp: false,
    disableOtherDrops: false,
};
