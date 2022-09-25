using BepInEx;
using cornercutter.Enum;
using HarmonyLib;
using System;
using System.Reflection;

namespace cornercutter.ModLoader
{
    [BepInPlugin("org.denko.plugins.cornercutter", "Cornercutter", "1.0.0.0")]
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
            try
            {
                CutterConfig.Instance.LoadCurrentConfig();
                if (CutterConfig.Instance.CornercutterIsEnabled())
                {
                    Console.WriteLine("Config loaded, let's rumble!");
                }
                else
                {
                    Console.WriteLine("Config loaded, but disabled ):");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Something went wrong loading the current mod:");
                Console.WriteLine(e);
                Console.WriteLine(e.InnerException);
                Console.WriteLine(e.StackTrace);

                Console.WriteLine("Resetting cornercutter to blank slate ...");
                CutterConfig.Instance.ClearConfig();
            }
        }
    }
}
