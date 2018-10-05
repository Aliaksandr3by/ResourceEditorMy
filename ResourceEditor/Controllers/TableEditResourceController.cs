using Kendo.Mvc.UI;
using ResourceEditor.Entities;
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

            string _pathLoad = ResourceHelper.GetPath(id);

            List<LangName> _langName = ResourceHelper.Read(_pathLoad);

            return Json(_langName);
        }

        public ActionResult Update([DataSourceRequest] DataSourceRequest request, LangName langName, string id = "en")
        {
            string _pathLoad = ResourceHelper.GetPath(id);

            List<LangName> _langName = ResourceHelper.Update(_pathLoad, langName);

            return Json(_langName);
        }

        public ActionResult Delete([DataSourceRequest] DataSourceRequest request, LangName langName, string id = "en")
        {
            string _pathLoad = ResourceHelper.GetPath(id);
            string result = default;

            //убрать
            List<LangName> _langName;
            if (ResourceHelper.Delete(_pathLoad, langName, out result))
            {
                _langName = ResourceHelper.Read(_pathLoad);
            }
            

            return Json(_langName);
        }

        public string _getJson(string id)
        {
            List<LangName> _langName = ResourceHelper.Read(ResourceHelper.GetPath(id));
            var a = ResourceHelper.ParceToJSON(_langName);
            return a + Environment.NewLine;
        }

    }
}
