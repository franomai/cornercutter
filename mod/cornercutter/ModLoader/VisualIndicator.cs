using HarmonyLib;
using System;
using System.Collections.Generic;
using TMPro;
using UnityEngine;

namespace cornercutter.ModLoader
{
    // TODO: Have this react to dynamic cornercutter enable / disable
    [HarmonyPatch(typeof(GUIManager), "Start")]
    class VisualIndicator
    {
        static void Prefix(ref GUIManager __instance)
        {
            GameObject canvas = __instance.hudCanvas.gameObject;
            TextMeshProUGUI text = canvas.AddComponent<TextMeshProUGUI>();
            
            text.font = __instance.dungeonName.font;
            text.fontSize = 18f;

            int width = Screen.width;
            int height = Screen.height;
            text.margin = new Vector4((float) width / 40, (float) height / 55);
            CutterConfig.Instance.SetVisualIndicator(text);
        }
    }

    [HarmonyPatch(typeof(LocalizedText), nameof(LocalizedText.GetText), new Type[] { typeof(string) })]
    class EndgameScreenNote
    {
        static readonly List<string> endgameStrings = new List<string>
        {
                "INTERN_EVAL_SUCCESS",
                "INTERN_EVAL_GIVEUP",
                "INTERN_EVAL_FAIL"
        };

        static void Postfix(ref string __result, string id)
        {
            CutterConfig cornercutter = CutterConfig.Instance;
            if (!cornercutter.CornercutterIsEnabled()) return;

            if (endgameStrings.Contains(id))
            {
                __result += cornercutter.HasCurrentMod ? " Corners were cut." : " No corners cut!";
            }
        }
    }
}
