namespace cornercutter.Enum
{
    // This is a enum used by FloorConfig, primarily to determine the behavior of .GetNextSkill in a SpawnOverride handler.
    // SpawnCollectionType.None should not come through from a mod, as the UI for it is a radio button.
    public enum SpawnCollectionType
    {
        None,
        Looped,
        Weighted,
        Consecutive
    }
}
