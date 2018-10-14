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
    [Serializable]
    public class LangName
    {

        [Required(ErrorMessage = "Please enter Id")]
        [RegularExpression(@"\w*", ErrorMessage = @"Please enter a valid key - \w*")]
        [Display(Name = "Id")]
        public string Id { get; set; }

        [Required(ErrorMessage = "Please Value")]
        [RegularExpression(@"\w*", ErrorMessage = @"Please enter a valid - \w*")]
        [Display(Name = "Value")]
        public string Value { get; set; }

        [Display(Name = "Comment")]
        public string Comment { get; set; }
    }
}