using ResourceEditor.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Resources;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Xml;
using System.Xml.Linq;

namespace ResourceEditor.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {

            return View();
        }

        [HttpPost]
        public ActionResult Data()
        {
            string Id = Request.Form["Id"];
            ResourceEditor.App_LocalResources.Resource.Culture = new CultureInfo(Id);

            if (System.IO.File.Exists(Server.MapPath($"~/App_LocalResources/Resource.{Id}.resx")))
            {
                ViewBag.cult = ResourceEditor.App_LocalResources.Resource.Culture;
            }
            else
            {
                ViewBag.cult = "en";
            }

            ResourceSet ResourceData = ResourceEditor.App_LocalResources.Resource.ResourceManager.GetResourceSet(new CultureInfo(Id), true, true);

            var resourceDictionary = ResourceData.Cast<DictionaryEntry>().ToDictionary(r => r.Key.ToString(), r => r.Value.ToString());

            //IEnumerable<string> query = fruits.Cast<string>().OrderBy(fruit => fruit).Select(fruit => fruit);

            return View(resourceDictionary);
        }

        public ActionResult Land()
        {
            List<LangName> _langs = new List<LangName>();

            string xmlFile = Server.MapPath("~/App_Data/cult.xml");
            XmlDocument xDoc = new XmlDocument();
            xDoc.Load(xmlFile);

            foreach (XmlNode xnode in xDoc.DocumentElement)
            {
                LangName country = new LangName();
                XmlNode attr = xnode.Attributes.GetNamedItem("name");
                country.Id = attr.Value;

                foreach (XmlNode item in xnode.ChildNodes)
                {
                    var a = item;
                    if (item.Name == nameof(LangName.Value))
                    {
                        country.Value = item.InnerText;
                    }
                    if (item.Name == nameof(LangName.Comment))
                    {
                        country.Comment = item.InnerText;
                    }

                }
                _langs.Add(country);
            }

            return View(_langs);
        }


    }
}