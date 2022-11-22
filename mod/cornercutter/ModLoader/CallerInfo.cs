using cornercutter.Enum;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Reflection;

namespace cornercutter.ModLoader
{
    class CallerInfo
    {
        public string MethodName { get; set; }
        public string ClassName { get; set; }

        public override bool Equals(object obj)
        {
            return obj is CallerInfo info &&
                   MethodName == info.MethodName &&
                   ClassName == info.ClassName;
        }

        // This code is auto-generated - EqualityComparer used to here to avoid a NPE on the two fields
        public override int GetHashCode()
        {
            var hashCode = 540619687;
            hashCode = hashCode * -1521134295 + EqualityComparer<string>.Default.GetHashCode(MethodName);
            hashCode = hashCode * -1521134295 + EqualityComparer<string>.Default.GetHashCode(ClassName);
            return hashCode;
        }

        public static CallerInfo GetCallerInfoFromStack(StackTrace stack, int frameNumber)
        {
            if (stack == null || frameNumber <= 0 || frameNumber > stack.FrameCount) return null;

            MethodBase sourceMethod = stack.GetFrame(frameNumber - 1).GetMethod();
            if (sourceMethod == null) return null;

            return new CallerInfo
            {
                MethodName = sourceMethod.Name,
                ClassName = sourceMethod.ReflectedType.Name
            };
        }

        // This is because the stack is usually
        // 1. IsAllowed method below
        // 2. Prefix we called from
        // 3. Method we are prefixing
        // 4. Method that called the prefixed method (the one we want)

        public static readonly int CALLER_FRAME_NUMBER = 4;

        public static bool IsAllowed(ConfigOptions flag, List<CallerInfo> allowedSources, int extraCalls = 0)
        {
            StackTrace stack = null;
            return IsAllowed(flag, allowedSources, ref stack, out _, extraCalls);
        }

        public static bool IsAllowed(ConfigOptions flag, List<CallerInfo> allowedSources, out CallerInfo caller, int extraCalls = 0)
        {
            StackTrace stack = null;
            return IsAllowed(flag, allowedSources, ref stack, out caller, extraCalls);
        }

        // There shouldn't really be a case where you need to make multiple calls (stack supplied) but don't need the caller (how would you tell otherwise?)

        public static bool IsAllowed(ConfigOptions flag, List<CallerInfo> allowedSources, ref StackTrace stack, out CallerInfo caller, int extraCalls = 0)
        {
            CutterConfig cornercutter = CutterConfig.Instance;
            ConfigOptions options = cornercutter.ConfigOptions;

            bool modEnabled = cornercutter.CornercutterIsEnabled() && cornercutter.ModIsActive();

            if (!(modEnabled && options.HasFlag(flag)))
            {
                caller = null;
                return true;
            }

            if (stack == null) stack = new StackTrace();
            caller = GetCallerInfoFromStack(new StackTrace(), CALLER_FRAME_NUMBER + extraCalls);
            if (caller == null) return false;

            cornercutter.LogDebug("Caller calculated as " + caller.MethodName + " in " + caller.ClassName);

            return allowedSources.Contains(caller);
        }
    }
}
