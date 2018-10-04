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
using ResourceEditor.Managers;

namespace ResourceEditor.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult DeleteLineResourceControl(string Id, string idDeleteElement)
        {
            string _pathSave = ResourceHelper.GetPath(Id, "App_LocalResources");

            List<LangName> _langName = ResourceHelper.Delete(_pathSave, idDeleteElement);

            ViewBag.result = $"{idDeleteElement} {Id} delete";

            return View("MainTableResource", _langName);
        }

        public ActionResult AddLineResource(List<LangName> list, string Id)
        {
            if (list != null) ResourceHelper.Insert(list, Id);

            return View();
        }

        public ActionResult MainTableResource(List<LangName> list, string Id)
        {

            string _pathSave = ResourceHelper.GetPath(Id);

            List<LangName> _langName = ResourceHelper.Read(_pathSave);

            ViewBag.result = "good";

            return View(_langName);
        }
        public PartialViewResult MainTableDataResource(List<LangName> list, string Id)
        {
            string _pathSave = ResourceHelper.GetPath(Id);

            List<LangName> _langName = ResourceHelper.Read(_pathSave);

            ViewBag.result = "good";

            ViewBag.cult = string.IsNullOrEmpty(Id) ? "" : Id;

            return PartialView(_langName);
        }
    }
}