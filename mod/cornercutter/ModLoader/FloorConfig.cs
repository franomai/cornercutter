using cornercutter.Enum;
using cornercutter.ModFeature.SpawnOverride.CollectionTypes;
using System;

namespace cornercutter.ModLoader
{
    // Enum for floor number, this maps across to the index returned by DungeonManager.currentFloor
    public enum Floor
    {
        AllFloors = 0,
        FirstFloor = 1,
        SecondFloor = 2,
        ThirdFloor = 3,
        Boss = 4,
    }

    class FloorConfig
    {
        public Floor Floor { get; private set; }
        public SpawnCollection AllSkills { get; private set; }
        public SpawnCollection FreeSkills { get; private set; }
        public SpawnCollection ShopSkills { get; private set; }
        public SpawnCollection CurseSkills { get; private set; }
        public SpawnCollection FinaleSkills { get; private set; }

        public FloorConfig(Floor floor)
        {
            Floor = floor;
            SpawnCollectionType collectionType = CutterConfig.Instance.SpawnCollectionType;
            AllSkills = CreateSpawnCollection(collectionType);
            FreeSkills = CreateSpawnCollection(collectionType);
            ShopSkills = CreateSpawnCollection(collectionType);
            CurseSkills = CreateSpawnCollection(collectionType);
            FinaleSkills = CreateSpawnCollection(collectionType);
        }
        private SpawnCollection CreateSpawnCollection(SpawnCollectionType collectionType)
        {
            SpawnCollection collection;
            switch (collectionType)
            {
                case SpawnCollectionType.Consecutive:
                    collection = new ConsecutiveSpawnCollection();
                    break;
                case SpawnCollectionType.Looped:
                    collection = new LoopingSpawnCollection();
                    break;
                case SpawnCollectionType.Weighted:
                    collection = new WeightedSpawnCollection();
                    break;
                default:
                    throw new Exception("Invalid spawn collection type!");
            }
            return collection;
        }
    }
}
