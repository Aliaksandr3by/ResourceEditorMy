using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Xml.Serialization;
using System.ComponentModel.Design;
using System.Resources;
using System.Collections;
using System.Reflection;
using System.IO;

namespace ResourceEditor.Models
{
    [Serializable]
    public class LangName
    {
        [XmlAttribute]
        public string Id { get; set; }
        [XmlAttribute]
        public string Value { get; set; }
        [XmlAttribute]
        public string Comment { get; set; }
    }
}