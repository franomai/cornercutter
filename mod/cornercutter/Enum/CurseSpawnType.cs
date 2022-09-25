namespace cornercutter.Enum
{
    // This is a enum used by CurseRoomSpawner to modify the spawn rate.
    // CurseSpawnType.None should not come through from a mod, as the UI for it is a radio button.
    public enum CurseSpawnType
    {
        None,
        Randomly,
        Always,
        AlwaysIfAble,
        Never
    }
}
