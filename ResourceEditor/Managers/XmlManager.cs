using ResourceEditor.Entities;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Hosting;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Serialization;

namespace ResourceEditor.Managers
{
    public static class XmlManager
    {
        public static IEnumerable<Entities.LangName> GetLanguages()
        {
            List<LangName> result = new List<LangName>();
            XmlDocument xDoc = new XmlDocument();
            xDoc.Load(System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/cult.xml"));

            foreach (XmlNode xnode in xDoc.DocumentElement)
            {
                LangName country = new LangName();
                XmlNode attr = xnode.Attributes.GetNamedItem("name");
                string _langNameAttr = attr.Value;

                foreach (XmlNode item in xnode.ChildNodes)
                {
                    if (item.Name == nameof(LangName.Id))
                    {
                        country.Id = item.InnerText;
                    }
                    if (item.Name == nameof(LangName.Value))
                    {
                        country.Value = item.InnerText;
                    }
                    if (item.Name == nameof(LangName.Comment))
                    {
                        country.Comment = item.InnerText;
                    }
                }
                result.Add(country);
            }
            return result.OrderBy(e=>e.Id).ToList();
        }

        static bool FinderLangSpec(XmlDocument docEx, CultureInfo myCIintlEx)
        {
            foreach (XmlNode xnode in docEx.DocumentElement)
            {
                XmlNode attr = xnode.Attributes.GetNamedItem("name");
                string _langNameAttr = attr.Value;

                if (attr.Value == myCIintlEx.Name)
                {
                    return false;
                }
            }
            return true;
        }

        static string CopyTextBetweenСharacters(char start, char end, string text)
        {
            int _start = text.IndexOf('.') + 1;
            int _end = text.IndexOf('.', _start);
            return text.Substring(_start, _end - _start).ToLower();
        }

        public static void SetLanguages(string fileName)
        {
            string pathXML = HostingEnvironment.MapPath("~/App_Data/cult.xml");

            string lg = CopyTextBetweenСharacters('.', '.', fileName);

            CultureInfo myCIintl = new CultureInfo(lg, false);

            XmlDocument doc = new XmlDocument();
            doc.Load(pathXML);

            if (FinderLangSpec(doc, myCIintl))
            {
                XmlNode root = doc.LastChild;

                XmlElement nod = doc.CreateElement("LangName");
                nod.SetAttribute("name", myCIintl.Name);

                XmlElement Id = doc.CreateElement("Id");
                Id.InnerText = myCIintl.Name;
                XmlElement Value = doc.CreateElement("Value");
                Value.InnerText = myCIintl.EnglishName;
                XmlElement Comment = doc.CreateElement("Comment");
                Comment.InnerText = myCIintl.NativeName;

                nod.AppendChild(Id);
                nod.AppendChild(Value);
                nod.AppendChild(Comment);

                root.AppendChild(nod);
                doc.Save(pathXML);
            }
        }

        public static bool SetLang(string fileName)
        {
            string pathXML = HostingEnvironment.MapPath("~/App_Data/cult.xml");

            string lg = CopyTextBetweenСharacters('.', '.', fileName);

            CultureInfo myCIintl = new CultureInfo(lg, false);

            XElement xDoc = XElement.Load(pathXML);

            var findLang = xDoc.Elements("LangName").FirstOrDefault(e => e.Attribute("name").Value == lg);

            if (findLang == null)
            {
                XElement doc = new XElement("LangName", new XAttribute("name", myCIintl.Name),
                    new XElement("Id", myCIintl.Name),
                    new XElement("Value", myCIintl.EnglishName),
                    new XElement("Comment", myCIintl.NativeName));

                xDoc.Add(doc);

                xDoc.Save(pathXML);

                return true;
            }
            else
            {
                return false;
            }
        }
    }
}