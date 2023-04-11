using cornercutter.Enum;
using cornercutter.ModLoader;
using HarmonyLib;
using System;
using System.Collections;
using UnityEngine;

namespace cornercutter.ModFeature.GlobalSetting
{
    // In order to send Jackie to CWS from the slide, we are intercepting the trigger
    // that is fired to have her exit it.
    [HarmonyPatch(typeof(Animator), nameof(Animator.SetTrigger), new Type[] { typeof(string) })]
    class CoWorkingSpaceSlide
    {
        // Flag for checking if we have been inside the slide, and
        // so whether to run a special animation next time we go back to Fizzle
        public static bool runAssociatedSlideAnimationNext = false;

        private static bool SlideGoesToCWS()
        {
            // This checks, amongst the other usual ones, that we are in the gone under Fizzle,
            // making sure you can't go to CWS unless it is actually unlocked and completed in game.
            // The game doesn't accomodate for completing CWS (and hence go under) before
            // you actually have the relics that let you go there in the first place
            CutterConfig cornercutter = CutterConfig.Instance;
            GlobalOptions globals = cornercutter.GlobalOptions;
            return cornercutter.CornercutterIsEnabled()
                && globals.HasFlag(GlobalOptions.SlideToCWS)
                && SaveData.instance.goneUnder;
        }

        static bool Prefix(string name)
        {
            // If we are in an animation that is not the slide, run the usual code
            if (name != "ExitSillySlide") return true;

            // If we are in the slide animation AT THE MOMENT, that means we want to complete it as usual
            // and the CWS teleport has already happened. Unset the flag and run the usual code.
            if (runAssociatedSlideAnimationNext)
            {
                runAssociatedSlideAnimationNext = false;
                return true;
            }

            if (!SlideGoesToCWS()) return true;

            // Flags the slide as entered and runs the scene load code from the other in-game dungeon triggers
            runAssociatedSlideAnimationNext = true;
            AudioManager.PlayOneShot("Jackie_Death");
            GUIManager.instance.LoadDungeonScene("Chaos", GlobalDungeons.dungeons.GetLoadingScreen(DungeonCompany.Chaos));
            GUIManager.instance.tasks.HideAll();

            // Don't run the usual slide exit code
            return false;
        }
    }

    [HarmonyPatch(typeof(EndgameScreen), "KilledBy")]
    class RunStatus
    {
        public static bool? runWon = null;
        static void Prefix()
        {
            // If the next run won isn't from the slide, we don't need to record it
            // This check is not strictly required but makes it clear this check is only to be used for the slide logic
            if (!CoWorkingSpaceSlide.runAssociatedSlideAnimationNext) return;
            runWon = Singleton<DungeonManager>.instance.currentRun.won;
        }
    }

    [HarmonyPatch(typeof(OfficeManager), nameof(OfficeManager.InitOffice))]
    class ExitSlideAfterCWSCompleted
    {
        static void Postfix()
        {
            // If we didn't go into the slide OR we did go in but we exited out to menu and came back in, skip the logic
            if (CoWorkingSpaceSlide.runAssociatedSlideAnimationNext && RunStatus.runWon != null)
            {
                SillySlide slideInfo = GameObject.Find("SillySlide").GetComponent<SillySlide>();
                Player player = Player.singlePlayer;

                // If the run is won, complete the slide animation as normal
                // If the run is lost or abandoned, drop Jackie from the sky
                if ((bool) RunStatus.runWon)
                {
                    player.inputVector = -slideInfo.transform.right;
                    player.lookVector = -slideInfo.transform.right;
                    player.transform.position = slideInfo.exitPos.position;
                    player.view.anim.SetTrigger("ExitSillySlide");
                    // Not locking the movement allows Jackie to do a power slide!
                    // I personally find this pretty funny, but to use the regular animation, you can add
                    // slideInfo.StartCoroutine(DisablePlayerForTime(player, slideInfo.waitTimeEnd));
                }
                else
                {
                    player.view.anim.SetTrigger("FallFromSky");
                    // 2.5f from DungeonManager.SlideInRoutine
                    slideInfo.StartCoroutine(DisablePlayerForTime(player, 2.5f));
                }
            }
            // Unset the won state and slide entry
            CoWorkingSpaceSlide.runAssociatedSlideAnimationNext = false;
            RunStatus.runWon = null;
        }

        // This is the logic that runs at the end of SillySlide.AdvanceRoutine usually,
        // but can be re-used effectively for the sky drop
        static private IEnumerator DisablePlayerForTime(Player player, float time)
        {
            player.LockMovement(true);
            player.rb.useGravity = false;
            yield return new WaitForSeconds(time);
            player.SetPhysicalCollidersActive(true);
            player.LockMovement(false);
            player.rb.useGravity = true;
        }
    }
}
