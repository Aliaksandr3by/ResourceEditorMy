using ResourceEditor.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Resources;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Xml;
using System.Xml.Linq;

namespace ResourceEditor.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult DeleteLineResourceControl(string Id, string idDeleteElement)
        {
            string _pathSave = ResourceHelper.PathResourceResolver(Id, "App_LocalResources");

            List<LangName> _langName = ResourceHelper.ReadResourceFile(_pathSave);
            ResourceHelper.CreateResourceFile(_langName, _pathSave, null, idDeleteElement);
            ViewBag.result = $"{idDeleteElement} {Id} ok";

            return View("MainTableResource", _langName);
        }

        public ActionResult AddLineResource(List<LangName> list, string Id)
        {
            string _pathSave = ResourceHelper.PathResourceResolver(Id, "App_LocalResources");

            if (list != null)
            {
                List<LangName> _langName = ResourceHelper.ReadResourceFile(_pathSave);
                ResourceHelper.CreateResourceFile(_langName, _pathSave, list);
            }
            return View();
        }

        public ActionResult MainTableResource(List<LangName> list, string Id)
        {
            string _pathSave = ResourceHelper.PathResourceResolver(Id, "App_LocalResources");

            ViewBag.cult = string.IsNullOrEmpty(Id) ? "" : Id;

            List<LangName> _langName = null;

            if (list != null && _langName == null)
            {
                _langName = list;
            }

            if (_langName == null && System.IO.File.Exists(_pathSave))
            {
                _langName = ResourceHelper.ReadResourceFile(_pathSave);
            }

            if (Request.Form["generateButton"] != null)
            {
                ResourceHelper.CreateResourceFile(_langName, _pathSave);
                ViewBag.result = "good";
            }

            return View(_langName);
        }
        public PartialViewResult MainTableDataResource(List<LangName> list, string Id)
        {
            string _pathSave = ResourceHelper.PathResourceResolver(Id, "App_LocalResources");

            ViewBag.cult = string.IsNullOrEmpty(Id) ? "" : Id;

            List<LangName> _langName = null;

            if (list != null && _langName == null)
            {
                _langName = list;
            }

            if (_langName == null && System.IO.File.Exists(_pathSave))
            {
                _langName = ResourceHelper.ReadResourceFile(_pathSave);
            }

            if (Request.Form["generateButton"] != null)
            {
                ResourceHelper.CreateResourceFile(_langName, _pathSave);
                ViewBag.result = "good";
            }

            return PartialView(_langName);
        }
        public string JsonResolver(string Id)
        {
            string _pathLoad = ResourceHelper.PathResourceResolver(Id, "App_LocalResources");

            List<LangName> _langName = ResourceHelper.ReadResourceFile(_pathLoad);

            return ResourceHelper.ParceToJSONMethod(_langName);
        }
    }
}