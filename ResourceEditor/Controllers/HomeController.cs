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
        public ActionResult Data(List<LangName> list)
        {
            string _id = "."+Request.Form["Id"];
            string _pathLoad = Server.MapPath($"~/App_LocalResources/Resource{_id}.resx");
            string _pathSave = Server.MapPath($"~/App_Data/Resource{_id}.resx");

            List<LangName> _langName = null;

            if (list != null && _langName == null)
            {
                _langName = list;
            }
            if (Request.Form["generateButton"] != null)
            {
                ResourceHelper.CreateResourceFile(_langName, _pathSave);
            }

            if (_langName == null)
            {
                _langName = new List<LangName>();
                if (System.IO.File.Exists(_pathLoad))
                {
                    ViewBag.cult = _id;
                    
                    _langName = ResourceHelper.ReadResourceFile(_langName, _pathLoad);
                }
                else
                {
                    ViewBag.cult = "en";
                    _langName = ResourceHelper.ReadResourceFile(_langName, Server.MapPath($"~/App_LocalResources/Resource.resx"));
                }
            }

            return View(_langName);
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