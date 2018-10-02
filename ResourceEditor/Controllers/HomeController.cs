﻿using ResourceEditor.Models;
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
        public ActionResult DeleteLineResourceControl()
        {
            string _idDeleteElement = Request.QueryString["IdDeleteElement"];
            string _id = Request.QueryString["Id"];
            string _pathLoad = null;
            string _pathSave = null;
            if (String.IsNullOrEmpty(_id))
            {
                _pathLoad = Server.MapPath($"~/App_LocalResources/Resource.resx");
                _pathSave = Server.MapPath($"~/App_LocalResources/Resource.resx");
            }
            else
            {
                _pathLoad = Server.MapPath($"~/App_LocalResources/Resource.{_id}.resx");
                _pathSave = Server.MapPath($"~/App_LocalResources/Resource.{_id}.resx");
            }

            List<LangName> _langName = ResourceHelper.ReadResourceFile(_pathLoad);
            ResourceHelper.CreateResourceFile(_langName, _pathSave,null, _idDeleteElement);
            ViewBag.result = $"{_idDeleteElement} {_id} ok";

            return View("Data", _langName);
        }

        public ActionResult AddLineResource(List<LangName> list, string Id)
        {
            string _pathLoad = null;
            string _pathSave = null;
            if (string.IsNullOrWhiteSpace(Id))
            {
                _pathLoad = Server.MapPath($"~/App_LocalResources/Resource.resx");
                _pathSave = Server.MapPath($"~/App_LocalResources/Resource.resx");
            }
            else
            {
                _pathLoad = Server.MapPath($"~/App_LocalResources/Resource.{Id}.resx");
                _pathSave = Server.MapPath($"~/App_LocalResources/Resource.{Id}.resx");
            }

            List<LangName> _langList;
            if (list != null)
            {
                _langList = new List<LangName>();
                List<LangName> _langName = ResourceHelper.ReadResourceFile(_pathLoad);
                ResourceHelper.CreateResourceFile(_langName, _pathSave, list);

            }
            return View();
        }

        public ActionResult Data(List<LangName> list)
        {
            string _id = Request.Form["Id"];
            string _pathLoad = null;
            string _pathSave = null;
            if (String.IsNullOrEmpty(_id))
            {
                 _pathLoad = Server.MapPath($"~/App_LocalResources/Resource.resx");
                 _pathSave = Server.MapPath($"~/App_LocalResources/Resource.resx");
            }
            else
            {
                _pathLoad = Server.MapPath($"~/App_LocalResources/Resource.{_id}.resx");
                _pathSave = Server.MapPath($"~/App_LocalResources/Resource.{_id}.resx");
            }

            ViewBag.cult = string.IsNullOrEmpty(_id) ? "" : _id;

            List<LangName> _langName = null;

            if (list != null && _langName == null)
            {
                _langName = list;
            }

            if (_langName == null && System.IO.File.Exists(_pathLoad))
            {
                _langName = ResourceHelper.ReadResourceFile(_pathLoad);
            }

            if (Request.Form["generateButton"] != null)
            {
                ResourceHelper.CreateResourceFile(_langName, _pathSave);
                ViewBag.result = "good";
            }

            return View(_langName);
        }
    }
}