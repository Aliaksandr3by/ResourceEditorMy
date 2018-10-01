using ResourceEditor.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using System.Xml;

namespace ResourceEditor.Managers
{
    public static class XmlManager
    {
        public static IEnumerable<Models.LangName> GetLanguages()
        {
            List<LangName> result = new List<LangName>();
            //string xmlFile = Path.GetFullPath(@"C:\\Users\\hole\\source\\repos\\ResourceEditorMy\\ResourceEditor\\App_Data\\cult.xml");
            //string xmlFile = Server.MapPath("~/App_Data/cult.xml");
            string xmlFile = System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/cult.xml");
            XmlDocument xDoc = new XmlDocument();
            xDoc.Load(xmlFile);

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
            return result;
        }
    }
}