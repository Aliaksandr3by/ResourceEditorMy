// --------------------------------------------------------------------------------------------------------------------
// <copyright file="LangName.cs" company="Alex">
//   free
// </copyright>
// <summary>
//   Defines the LangName type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace ResourceEditor.Entities
{
    using System;
    using System.ComponentModel.DataAnnotations;

    /// <summary>
    /// The lang name.
    /// </summary>
    [Serializable]
    public class LangName
    {
        /// <summary>
        /// Gets or sets the id.
        /// </summary>
        [Required(ErrorMessage = "Please enter Id")]
        [RegularExpression(@"\w*", ErrorMessage = @"Please enter a valid key - \w*")]
        [Display(Name = "Id")]
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets the value.
        /// </summary>
        [Required(ErrorMessage = "Please Value")]
        [RegularExpression(@"\w*", ErrorMessage = @"Please enter a valid value - \w*")]
        [Display(Name = "Value")]
        public string Value { get; set; }

        /// <summary>
        /// Gets or sets the comment.
        /// </summary>
        [Display(Name = "Comment")]
        public string Comment { get; set; }
    }
    public class LangNameLog : LangName
    {
        public string StatusLog { get; set; }

        public string DateLog { get; set; }

        public string PathLog { get; set; }

        public static explicit operator string(LangNameLog obj)
        {
            return $"{obj.StatusLog} - {obj.DateLog} - {obj.PathLog}{Environment.NewLine}" ;
        }
    }
    public class LangNameLogFull
    {
        public LangName LangNameSampleEN { get; set; }
        public LangName LangNameOld { get; set; }
        public LangName LangNameNew { get; set; }
        public string StatusLog { get; set; }
        public string DateLog { get; set; }
        public string PathLog { get; set; }
    }
}