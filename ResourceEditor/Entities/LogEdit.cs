using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ResourceEditor.Entities
{
    public class LogEdit
    {
        public LangName LangNameSampleEN { get; set; }
        public LangName LangNameOld { get; set; }
        public LangName LangNameNew { get; set; }
        public string StatusLog { get; set; }
        public string DateLog { get; set; }
        public string PathLog { get; set; }
    }
}