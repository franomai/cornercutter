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
            try
            {
                CutterConfig.Instance.Setup(Logger);
                Logger.LogInfo("Cornercutter is loaded!");
            }
            catch (Exception e)
            {
                Logger.LogError("Couldn't load base cornercutter info:");
                Logger.LogError(e);

                Logger.LogError("Putting cornercutter to sleep ...");
                CutterConfig.Instance.ShutdownCornercutter();
            }

            // Loads all patches for cornercutter on startup
            Harmony.CreateAndPatchAll(Assembly.GetExecutingAssembly());
            Logger.LogInfo("Patches are alive, ready to rock ...");
        }
    }

    [HarmonyPatch(typeof(GUIManager), nameof(GUIManager.LoadFizzle))]
    class FizzleReloader
    {
        static void Postfix()
        {
            CutterConfig cornercutter = CutterConfig.Instance;
            cornercutter.LogInfo("Reloaded Fizzle, reloading base cornercutter config ...");
            try
            {
                CutterConfig.Instance.Setup();
                cornercutter.LogInfo("Cornercutter is loaded!");
            }
            catch (Exception e)
            {
                cornercutter.LogError("Couldn't reload cornercutter info:");
                cornercutter.LogError(e);

                cornercutter.LogError("Putting cornercutter to sleep ...");
                CutterConfig.Instance.ShutdownCornercutter();
            }
        }
    }

    [HarmonyPatch(typeof(DungeonManager), nameof(DungeonManager.Awake))]
    class ConfigLoader
    {
        static void Postfix()
        {
            CutterConfig cornercutter = CutterConfig.Instance;
            // This method fires when a new dungeon is started - meaning new mods won't be hotloaded,
            // but instead will be picked up on the next run.
            cornercutter.LogInfo("Loading current cornercutter config ...");
            try
            {
                cornercutter.LoadCurrentConfig();
                if (cornercutter.CornercutterIsEnabled())
                {
                    if (cornercutter.ModIsActive())
                    {
                        cornercutter.LogInfo("Config loaded, let's rumble!");
                    }
                    else
                    {
                        cornercutter.LogInfo("Config loaded, no current mod ):");
                    }  
                }
                else
                {
                    cornercutter.LogInfo("Config loaded, but disabled ):");
                }
            }
            catch (Exception e)
            {
                cornercutter.LogError("Something went wrong loading the current mod:");
                cornercutter.LogError(e);

                cornercutter.LogError("Putting cornercutter to sleep ...");
                cornercutter.ShutdownCornercutter();
            }
        }
    }
}
