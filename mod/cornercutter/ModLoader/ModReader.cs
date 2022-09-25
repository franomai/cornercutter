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
        public ModConfigDTO ReadMod(string path)
        {
            using (StreamReader file = File.OpenText(path))
            {
                JsonSerializer serializer = new JsonSerializer();
                return (ModConfigDTO) serializer.Deserialize(file, typeof(ModConfigDTO));
            }
        }
    }
}
