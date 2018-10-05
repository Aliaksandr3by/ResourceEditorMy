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
using System.Runtime.Serialization;

namespace ResourceEditor.Entities
{
    [DataContract]
    public class LangName
    {
       
        [DataMember]
        public string Id { get; set; }
        [DataMember]
        public string Value { get; set; }
        [DataMember]
        public string Comment { get; set; }
    }
}