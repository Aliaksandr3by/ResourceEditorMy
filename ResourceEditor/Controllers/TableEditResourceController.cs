﻿using Kendo.Mvc.UI;
using ResourceEditor.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ResourceEditor.Controllers
{
    public class TableEditResourceController : Controller
    {
        public ViewResult ReadCrud()
        {
            return View();
        }

        public ActionResult Read([DataSourceRequest] DataSourceRequest request, string id)
        {
            //string id = request.Filters ?? request.Filters.Where((e)=> e.Equals("language")).ToString();

            string _pathLoad = ResourceHelper.GetPath(id, "App_LocalResources");

            List<LangName> _langName = ResourceHelper.GetAll(_pathLoad);
            var temp = Json(_langName);
            return temp;
        }

        public ActionResult Edit([DataSourceRequest] DataSourceRequest request, string id)
        {
            string _pathLoad = ResourceHelper.GetPath(id, "App_LocalResources");

            List<LangName> _langName = ResourceHelper.GetAll(_pathLoad);
            var temp = Json(_langName);
            return temp;
        }

    }
}