using cornercutter.DTO;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace cornercutter.ModLoader
{
    class ModReader
    {
        private JsonSerializer Serializer = new JsonSerializer();

        public ModConfigDTO ReadMod(string path)
        {
            using (StreamReader file = File.OpenText(path))
            {
                return (ModConfigDTO) Serializer.Deserialize(file, typeof(ModConfigDTO));
            }
        }

        // Could make this read method generic but probably not required
        public GlobalInfoDTO ReadGlobalInfo(string path)
        {
            using (StreamReader file = File.OpenText(path))
            {
                return (GlobalInfoDTO)Serializer.Deserialize(file, typeof(GlobalInfoDTO));
            }
        }
    }
}
