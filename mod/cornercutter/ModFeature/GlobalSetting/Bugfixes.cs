using HarmonyLib;
using System;
using System.Collections.Generic;
using System.Text;
using UnityEngine;

namespace cornercutter.ModFeature.GlobalSetting
{
    [HarmonyPatch(typeof(BridgeBurner), "OnApplied")]
    class MakeBridgeBurnerPinnable
    {
        static bool Prefix(ref BridgeBurner __instance)
        {
            Player.singlePlayer.bridgeBurner *= __instance.value;
            Room currentRoom = Player.singlePlayer.GetRoom();
            if (currentRoom != null)
            {
                AmbientLightController.instance.SetAesthetic(currentRoom.aesthetics, 0f);
            }
            return false;
        }
    }

    [HarmonyPatch(typeof(GUI), nameof(GUI.Label), new Type[] { typeof(Rect), typeof(string), typeof(GUIStyle) })]
    class RestyleFPSDisplay
    {
        static void Prefix(ref Rect position, ref GUIStyle style)
        {
            // Ideally we would be modifying the FPSDisplay method directly, however the label
            // generated doesn't have any reference to it and the timer itself is private
            // Furthermore, we can't check the source of this call as inspecting the callstack is
            // resource intensive ):
            if (position.width == Screen.width && style.normal.textColor == Color.red)
            {
                position.width = position.width / 12;
                position.height += 8f;
                Texture2D background = new Texture2D(1, 1);
                background.SetPixel(0, 0, new Color32(22, 38, 54, 255));
                background.Apply();
                style.normal.background = background;
                style.normal.textColor = new Color32(164, 187, 201, 255);
            }
        }
    }

    [HarmonyPatch(typeof(Chungus), "IncreaseEnemyHealth")]
    class OneHPEnemies
    {
        public static void SetHPToOne(Enemy enemy)
        {
            if (DebugSettings.settings.enemy1hp && enemy != null)
            {
                enemy.health = 1f;
            }
        }

        static bool Prefix()
        {
            return !DebugSettings.settings.enemy1hp;
        }
    }

    [HarmonyPatch(typeof(ManHand), nameof(ManHand.Revive))]
    class HoverHandsFaintReset
    {
        static void Postfix(ref ManHand __instance)
        {
            OneHPEnemies.SetHPToOne(__instance);
        }
    }

    [HarmonyPatch(typeof(HoverHandsModifier), "ModifyBoss")]
    class ImposterHoverHandsReset
    {
        static void Postfix(ref HoverHandsModifier __instance)
        {
            OneHPEnemies.SetHPToOne(__instance.GetComponent<Enemy>());
        }
    }

    [HarmonyPatch(typeof(CaffiendModifier), "ModifyBoss")]
    class ImposterCaffiendReset
    {
        static void Postfix(ref CaffiendModifier __instance)
        {
            OneHPEnemies.SetHPToOne(__instance.GetComponent<Enemy>());
        }
    }

    [HarmonyPatch(typeof(HustlebonesModifier), "ModifyBoss")]
    class ImposterHustleBonesReset
    {
        static void Postfix(ref HustlebonesModifier __instance)
        {
            OneHPEnemies.SetHPToOne(__instance.GetComponent<Enemy>());
        }
    }

    [HarmonyPatch(typeof(Caffiend), "GetPumped")]
    class FixCaffiendCutsceneSoftlock
    {
        static void Prefix()
        {
            if (CameraController.instance.state == CameraState.TrackingPlayer)
            {
                // If we have free camera control because the cutscene ended before the
                // pump method started, unlock our movement
                Player.singlePlayer.LockMovement(false);
            }
        }
    }
}
