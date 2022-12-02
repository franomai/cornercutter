import { OptionDetails } from '../../components/forms/TooltipCheckbox';

export enum ModOptions {
    NoneSelected = 0,
    ConfigPerFloor = 1 << 0,
    ConfigPerRoom = 1 << 1,
    SelectRandomItemOnEmpty = 1 << 2,
    DisableMentorAbilities = 1 << 3,
    DisableGiftOfIntern = 1 << 4,
    DisablePinned = 1 << 5,
    AwardSkillsPerFloor = 1 << 6,
    DisableHealing = 1 << 7,
    DisableItemPickup = 1 << 8,
}

export const generalModOptionDetails: Record<ModOptions, OptionDetails> = {
    [ModOptions.ConfigPerFloor]: {
        label: 'Configure spawns per floor',
        tooltip: 'Set skills up on a floor by floor basis.',
    },
    [ModOptions.ConfigPerRoom]: {
        label: 'Configure spawns per room',
        tooltip:
            'Set skills up based on room type / function. Non-applicable types will be ignored (for example, finale for boss floors).',
    },
    [ModOptions.AwardSkillsPerFloor]: {
        label: 'Award starting skills per floor',
        tooltip:
            'Enabling this will grant starting skills at the start of every floor. Otherwise, they will only be granted on dungeon start.',
    },
    [ModOptions.SelectRandomItemOnEmpty]: {
        label: 'Grant random item when out of mod items',
        tooltip:
            'If a spawn pool runs out, or a pool has no skills added, enabling this will fallback to the usual spawner logic for that room. Otherwise, gift of the intern will spawn.',
    },
    [ModOptions.DisableMentorAbilities]: {
        label: 'Disable mentor abilities',
        tooltip: 'When enabled, any mentor abilities will be deactivated.',
    },
    [ModOptions.DisableGiftOfIntern]: {
        label: 'Disable gift of the intern',
        tooltip:
            'Gift of the intern is a fallback skill that spawns when nothing else can, granting a small bonus (cash, an app, health, etc.) - enabling this will spawn nothing instead.',
    },
    [ModOptions.DisablePinned]: {
        label: 'Disable pinned skills',
        tooltip: 'When enabled, the pinned skill will not be granted at the start of the dungeon.',
    },
    [ModOptions.DisableHealing]: {
        label: 'Disable healing and armour from non-skills',
        tooltip: 'When enabled, anything that grants armour or health will do nothing instead, except for skills.',
    },
    [ModOptions.DisableItemPickup]: {
        label: 'Disable item pickups from non-skills',
        tooltip: 'When enabled, trying to pick up or otherwise gain items or weapons will do nothing instead.',
    },
};
