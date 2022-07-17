using BepInEx;
using HarmonyLib;
using System;
using System.Reflection;

namespace cornercutter
{
    [BepInPlugin("org.denko.plugins.cornercutter", "Cornercutter Spawn Modifier", "1.0.0.0")]
    public class Cornercutter : BaseUnityPlugin
    {
        private void Awake()
        {
            // Loads all patches for cornercutter on startup
            Logger.LogInfo("Cornercutter is loaded!");
            Harmony.CreateAndPatchAll(Assembly.GetExecutingAssembly());
            Logger.LogInfo("Patches are alive, ready to rock ...");
        }
    }

    [HarmonyPatch(typeof(DungeonManager), nameof(DungeonManager.Awake))]
    class ConfigLoader
    {
        static void Postfix()
        {
            // This method fires when a new dungeon is started - meaning new mods won't be hotloaded,
            // but instead will be picked up on the next run.
            Console.WriteLine("Loading current cornercutter config ...");
            CutterConfig.GetInstance().LoadCurrentConfig();
            Console.WriteLine("Config loaded, let's rumble!");
        }
    }
}
