using cornercutter.Enum;
using cornercutter.ModLoader;
using HarmonyLib;

namespace cornercutter.ModFeature.ModSetting
{
    [HarmonyPatch(typeof(Player), nameof(Player.TryApplyStartingSkills))]
    class StartingSkillBlocker
    {
        class SkillStorage
        {
            public string CurrentStartingSkill { get; set; }
            public Employee CurrentMentor { get; set; }
        }

        static void Prefix(ref SkillStorage __state)
        {
            CutterConfig cornercutter = CutterConfig.Instance;
            if (!(cornercutter.CornercutterIsEnabled() && cornercutter.ModIsActive())) return;

            __state = new SkillStorage()
            {
                CurrentStartingSkill = SaveData.instance.currentStartingSkill,
                CurrentMentor = SaveData.instance.currentMentor
            };

            ConfigOptions options = CutterConfig.Instance.ConfigOptions;

            if (options.HasFlag(ConfigOptions.DisablePinnedSkill)) {
                SaveData.instance.currentStartingSkill = null;
            }

            if (options.HasFlag(ConfigOptions.DisableMentorAbilities))
            {
                SaveData.instance.currentMentor = Employee.NONE;
            }
        }

        static void Postfix(SkillStorage __state)
        {
            if (__state != null)
            {
                SaveData.instance.currentStartingSkill = __state.CurrentStartingSkill;
                SaveData.instance.currentMentor = __state.CurrentMentor;
            }
        }
    }
}
