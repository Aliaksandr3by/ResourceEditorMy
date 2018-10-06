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
using System.ComponentModel.DataAnnotations;

namespace ResourceEditor.Entities
{
    [DataContract]
    public class LangName
    {

        [Required(ErrorMessage = "Please enter Id")]
        [RegularExpression(@"\w*", ErrorMessage = "Please enter a valid")]
        [Display(Name = "Id")]
        [DataMember]
        public string Id { get; set; }

        [Required(ErrorMessage = "Please Value")]
        [RegularExpression(@"\w*", ErrorMessage = "Please enter a valid")]
        [Display(Name = "Value")]
        [DataMember]
        public string Value { get; set; }

        [Display(Name = "Comment")]
        [DataMember]
        public string Comment { get; set; }
    }
}