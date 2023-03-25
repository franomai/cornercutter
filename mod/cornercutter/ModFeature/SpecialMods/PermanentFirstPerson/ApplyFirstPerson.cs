using cornercutter.ModLoader;
using HarmonyLib;

namespace cornercutter.ModFeature.SpecialMods.PermanentFirstPerson
{
    [HarmonyPatch(typeof(DungeonManager), nameof(DungeonManager.StartFloor))]
    class PermanentFirstPerson
    {
        public static bool FirstPersonIsEnabled()
        {
            CutterConfig cornercutter = CutterConfig.Instance;
            return cornercutter.CornercutterIsEnabled()
                && cornercutter.IsSpecialModActive(ModNames.SpecialMod.FirstPerson);
        }

        // SelfCentered methods *could* be accessed with reflection, but easier to do like this
        // and we may also want to change how this mode operates compared to the default
        public static void ApplyFirstPersonCurse()
        {
            CutterConfig.Instance.LogDebug("Applying first person curse...");
            Player.singlePlayer.firstPerson = true;
            CameraController.instance.SetFov(60f);
            CameraController.mainCam.nearClipPlane = 0.1f;
            GameManager.events.OnFloorEnterLate -= new EventManager.FloorEnterLateDel(ApplyFirstPersonCurse);
        }

        static void Prefix(DungeonManager __instance)
        {
            // Only want to apply this on the first floor
            // Cubicle will be handled by a seperate patch
            if (__instance.currentFloor != 0 || __instance.name == "Cubicle Dungeon Manager") return;
            if (!FirstPersonIsEnabled()) return;
            GameManager.events.OnFloorEnterLate += new EventManager.FloorEnterLateDel(ApplyFirstPersonCurse);
        }
    }

    [HarmonyPatch(typeof(CubicleDungeonManager), "SlideInRoutine")]
    class CallFloorEnteredFromCubicle
    {
        // As this dungeon has a special enterance, they forgot to call the late enter code
        // Although this wouldn't matter in regular gameplay, it does here!
        // As we want to apply this for both floor 0 and 1, we will just call the curse code
        static void Postfix()
        {
            if (PermanentFirstPerson.FirstPersonIsEnabled()) PermanentFirstPerson.ApplyFirstPersonCurse();
        }
    }

    [HarmonyPatch(typeof(SelfCentered), "OnRemoved")]
    class UndoSelfCenteredRemoval
    {
        static void Postfix()
        {
            // We actually want the base curse removal to still proc, so we will undo everything in post
            // Floor delegate removal will do nothing if it doesn't exist
            if (PermanentFirstPerson.FirstPersonIsEnabled()) PermanentFirstPerson.ApplyFirstPersonCurse();
        }
    }

    [HarmonyPatch(typeof(CameraController), nameof(CameraController.SetFov))]
    class FixAvieTeleportFov
    {
        static void Prefix(ref float fov)
        {
            if (PermanentFirstPerson.FirstPersonIsEnabled() && Player.singlePlayer.firstPerson && fov == 30f)
            {
                // Every standard fov change touches singlePlayer.firstPerson except for the Avie teleport
                // which hard sets it to 30! This zooms you in way too far, so we have to prevent it.
                fov = 60f;
            }
        }
    }
}
