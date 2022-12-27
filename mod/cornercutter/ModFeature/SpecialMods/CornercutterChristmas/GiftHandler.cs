using HarmonyLib;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

namespace cornercutter.ModFeature.SpecialMods.CornercutterChristmas
{
    class ChristmasGift
    {
        public string Name { get; }
        public string Description { get; }
        public string VagueDescription { get; }
        public string OnAppliedText { get; }

        public ChristmasGift(string name, string description,
            string vagueDescription, string onAppliedText)
        {
            Name = name;
            Description = description;
            VagueDescription = vagueDescription;
            OnAppliedText = onAppliedText;
        }
    }

    [HarmonyPatch(typeof(EntitySpawner), nameof(EntitySpawner.PickItemToSpawn))]
    class GiftHandler
    {
        public enum GiftType
        {
            None,
            RandomSkills,
            AppsGrantNewApps,
            RandomFollowers,
            SpeedAndKnockbackIncrease,
            EnemiesExplodeIntoWeapons,
            ItemsAreRarer,
            KillsForceCrits,
            BuyingFromShopsWeakensEnemies,
            CratesDropMoreItems
        }

        static readonly Dictionary<GiftType, ChristmasGift> PossibleGifts = new Dictionary<GiftType, ChristmasGift>
        {
            { GiftType.RandomSkills, new ChristmasGift(
                "Jack(ie) of all trades",
                "You discovered 5 random skills you never knew you had! College degrees aren't just for debt balls.",
                "You feel... overqualified.",
                "Knowledge up!") },
            { GiftType.AppsGrantNewApps, new ChristmasGift(
                "Free RAM, downloaded",
                "Apps might give you a new app when you're done! Maybe you SHOULD keep installing things you find on the floor.",
                "Probably not malware...",
                "Memory up!") },
            { GiftType.RandomFollowers, new ChristmasGift(
                "The power of friendship",
                "5 followers join your crew! We put out an ad for monsters that love collaboration and walking into torches.",
                "Sounds like quite the party in there...",
                "Teamwork up!") },
            { GiftType.SpeedAndKnockbackIncrease, new ChristmasGift(
                "Gift of the girlboss",
                "Places to be! People to push around! I'LL SLEEP WHEN I'M REDUNDANT.",
                "And why does it keep shaking?",
                "Energy up!") },
            { GiftType.EnemiesExplodeIntoWeapons, new ChristmasGift(
                "It's time for a lootsplosion!",
                "Killing enemies will EXPLODE them into items. A fitting reward for Fizzle's number one badass.",
                "Or, a better question, EXPLOSIONS?",
                "Carnage up!") },
            { GiftType.ItemsAreRarer, new ChristmasGift(
                "Luck of the draw",
                "Everything feels rarer! You should watch out for black cats, broken mirrors, and unpaid internships (just generally)",
                "Maybe a legendary this time?",
                "Rate up!") },
             { GiftType.KillsForceCrits, new ChristmasGift(
                "C-c-combo crits",
                "Killing enemies gives you crits which lets you kill more enemies which gives you crits which lets you kill more enemies which gives you crits which lets you",
                "What's inside? What's inside?",
                "Crits up! Crits up! Crits up!") },
             { GiftType.BuyingFromShopsWeakensEnemies, new ChristmasGift(
                "Big spender",
                "Buying from shops makes some enemies weaker. They're weaker because they're sad they forgot to buy YOU something. :(",
                "You feel like all those purchases are about to pay off!",
                "Spending up!") },
             { GiftType.CratesDropMoreItems, new ChristmasGift(
                "Plethora",
                "More items in every box! Thanks, that means a lot.",
                "And why is it so heavy?",
                "Stuff up!") }
        };

        public static readonly Dictionary<GiftType, int> CurrentStacks = System.Enum.GetValues(typeof(GiftType))
            .Cast<GiftType>().ToDictionary(giftType => giftType, giftType => 0);

        public static (GiftType, ChristmasGift) GetChristmasGiftById(int giftId)
        {
            if (!System.Enum.IsDefined(typeof(GiftType), giftId)) return (GiftType.None, null);
            GiftType giftType = (GiftType)giftId;
            ChristmasGift gift = PossibleGifts.ContainsKey(giftType) ? PossibleGifts[giftType] : null;
            return (giftType, gift);
        }

        static readonly System.Random rng = new System.Random();

        static void Postfix(ref GameObject __result)
        {
            if (__result != GlobalSettings.defaults.fallbackSkill) return;
            // Make this a christmas gift instead
            List<GiftType> giftRefs = new List<GiftType>(PossibleGifts.Keys);
            int giftRef = (int) giftRefs[rng.Next(giftRefs.Count)];
            ModPickup pickup = __result.GetComponent<ModPickup>();
            EntityMod mod = pickup.mod;
            mod.pointCost = giftRef;
        }

        public static bool ApplyGiftEffect(int giftId, BackupSkill skillInstance)
        {
            (GiftType, ChristmasGift) giftInfo = GetChristmasGiftById(giftId);
            GiftType giftType = giftInfo.Item1;
            ChristmasGift gift = giftInfo.Item2;
            if (giftType == GiftType.None || (gift == null)) return false;
            bool wasSuccessful = GiftEffects.RunGiftOnApplied(giftType, skillInstance);
            if (wasSuccessful)
            {
                Player singlePlayer = Player.singlePlayer;
                Vector3 pos = singlePlayer.GetCenter() + Vector3.up * 1.5f;
                ParticleManager.instance.SpawnAnyText(pos, gift.OnAppliedText, 6f);
            }
            return wasSuccessful;
        }

        public static void RemoveGiftEffect(int giftId, BackupSkill skillInstance)
        {
            (GiftType, ChristmasGift) giftInfo = GetChristmasGiftById(giftId);
            GiftType giftType = giftInfo.Item1;
            if (giftType == GiftType.None) return;
            GiftEffects.RunGiftOnRemoved(giftType, skillInstance);
        }

        public static void InitializeGiftListeners(int giftId, BackupSkill skillInstance)
        {
            (GiftType, ChristmasGift) giftInfo = GetChristmasGiftById(giftId);
            GiftType giftType = giftInfo.Item1;
            if (giftType == GiftType.None) return;
            int currentStacks = CurrentStacks[giftType]++;
            if (currentStacks == 0) GiftListeners.RegisterListeners(giftType);
            return;
        }

        public static void RemoveGiftListeners(int giftId, BackupSkill skillInstance)
        {
            (GiftType, ChristmasGift) giftInfo = GetChristmasGiftById(giftId);
            GiftType giftType = giftInfo.Item1;
            if (giftType == GiftType.None) return;
            int currentStacks = --CurrentStacks[giftType];
            if (currentStacks == 0) GiftListeners.DeregisterListeners(giftType);
            return;
        }
    }
}
