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
        [RegularExpression(@"\w*", ErrorMessage = @"Please enter a valid - \w*")]
        [Display(Name = "Value")]
        public string Value { get; set; }

        /// <summary>
        /// Gets or sets the comment.
        /// </summary>
        [Display(Name = "Comment")]
        public string Comment { get; set; }
    }
}