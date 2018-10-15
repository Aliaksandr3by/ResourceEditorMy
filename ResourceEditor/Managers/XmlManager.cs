// --------------------------------------------------------------------------------------------------------------------
// <copyright file="XmlManager.cs" company="Alex">
//   free
// </copyright>
// <summary>
//   The xml manager.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace ResourceEditor.Managers
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.IO;
    using System.Linq;
    using System.Web.Hosting;
    using System.Xml;
    using System.Xml.Linq;

    using ResourceEditor.Entities;

    /// <summary>
    /// The xml manager.
    /// </summary>
    public static class XmlManager
    {
        /// <summary>
        /// The get languages.
        /// </summary>
        /// <returns>
        /// The <see>
        ///         <cref>IEnumerable</cref>
        ///     </see>
        ///     lang list.
        /// </returns>
        public static IEnumerable<LangName> GetLanguages()
        {
            var result = new List<LangName>();
            var xDoc = new XmlDocument();
            xDoc.Load(HostingEnvironment.MapPath("~/App_Data/cult.xml") ?? throw new InvalidOperationException());

            if (xDoc.DocumentElement != null)
            {
                foreach (XmlNode items in xDoc.DocumentElement)
                {
                    var country = new LangName();

                    foreach (XmlNode item in items.ChildNodes)
                    {
                        switch (item.Name)
                        {
                            case nameof(LangName.Id):
                                country.Id = item.InnerText;
                                break;
                            case nameof(LangName.Value):
                                country.Value = item.InnerText;
                                break;
                            case nameof(LangName.Comment):
                                country.Comment = item.InnerText;
                                break;
                        }
                    }

                    result.Add(country);
                }
            }

            return result.OrderBy(e => e.Id).ToList();
        }

        /// <summary>
        /// Checks for a language in the list
        /// </summary>
        /// <param name="xDoc">Xml Document</param>
        /// <param name="culture">Culture info</param>
        /// <returns>true if language not found</returns>
        public static bool? FinderLang(XmlDocument xDoc, CultureInfo culture)
        {
            foreach (XmlNode item in xDoc.DocumentElement ?? throw new InvalidOperationException())
            {
                if (item.Attributes?.GetNamedItem("name").Value == culture.Name)
                {
                    return false;
                }
            }

            return true;
        }

        /// <summary>
        /// Copy Text Between Character
        /// </summary>
        /// <param name="start">first symbol</param>
        /// <param name="end">second symbol</param>
        /// <param name="text">base text</param>
        /// <returns>new text between symbols</returns>
        public static string CopyTextBetweenSymbols(char start, char end, string text)
        {
            var startPosition = text.IndexOf('.') + 1;
            var endPosition = text.IndexOf('.', startPosition);
            var length = endPosition - startPosition;

            return length > 0 ? text.Substring(startPosition, endPosition - startPosition) : "en";
        }

        /// <summary>
        /// This method add language
        /// </summary>
        /// <param name="fileName">path to file name</param>
        [Obsolete]
        public static void AddLanguages(string fileName)
        {
            var pathXml = HostingEnvironment.MapPath("~/App_Data/cult.xml");

            var lg = CopyTextBetweenSymbols('.', '.', fileName);

            var cultureInfo = new CultureInfo(lg, false);

            var doc = new XmlDocument();
            doc.Load(pathXml ?? throw new InvalidOperationException());

            if (FinderLang(doc, cultureInfo) ?? false)
            {
                XmlNode root = doc.LastChild;

                XmlElement nod = doc.CreateElement("LangName");
                nod.SetAttribute("name", cultureInfo.Name);

                XmlElement id = doc.CreateElement("Id");
                id.InnerText = cultureInfo.Name;
                XmlElement value = doc.CreateElement("Value");
                value.InnerText = cultureInfo.EnglishName;
                XmlElement comment = doc.CreateElement("Comment");
                comment.InnerText = cultureInfo.NativeName;

                nod.AppendChild(id);
                nod.AppendChild(value);
                nod.AppendChild(comment);

                root.AppendChild(nod);
                doc.Save(pathXml);
            }
        }

        /// <summary>
        /// The set lang.
        /// </summary>
        /// <param name="fileName">
        /// The file name.
        /// </param>
        /// <returns>
        /// The <see cref="bool"/>.
        /// </returns>
        public static bool SetLang(string fileName)
        {
            var pathXml = HostingEnvironment.MapPath("~/App_Data/cult.xml");

            if (File.Exists(pathXml))
            {
                var lg = CopyTextBetweenSymbols('.', '.', fileName);

                var cultureInfo = new CultureInfo(lg, false);

                var xDoc = XElement.Load(pathXml ?? throw new InvalidOperationException());

                var findLang = xDoc.Elements("LangName").FirstOrDefault(e => e.Attribute("name")?.Value == lg);

                if (findLang == null)
                {
                    var newLang = new LangName()
                                      {
                                          Id = cultureInfo.Name,
                                          Value = cultureInfo.EnglishName,
                                          Comment = cultureInfo.NativeName
                                      };

                    var doc = new XElement(
                        nameof(LangName),
                        new XAttribute("name", cultureInfo.Name),
                        new XElement(nameof(newLang.Id), newLang.Id),
                        new XElement(nameof(newLang.Value), newLang.Value),
                        new XElement(nameof(newLang.Comment), newLang.Comment));

                    xDoc.Add(doc);

                    xDoc.Save(pathXml);

                    return true;
                }
            }

            return false;
        }
    }
}