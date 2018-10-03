using Kendo.Mvc.UI;
using ResourceEditor.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ResourceEditor.Controllers
{
    public class CRUDKendoTableController : Controller
    {
        public ViewResult ReadCrud()
        {
            return View();
        }

        public ActionResult Read([DataSourceRequest] DataSourceRequest request, string id)
        {
            //string id = request.Filters ?? request.Filters.Where((e)=> e.Equals("language")).ToString();

            string _pathLoad = ResourceHelper.PathResourceResolver(id, "App_LocalResources");

            List<LangName> _langName = ResourceHelper.ReadResourceFile(_pathLoad);
            var temp1 = Json(_langName);
            string tempJsonDataTableResource = ResourceHelper.ParceToJSONMethod(_langName);
            var tmp = Json(tempJsonDataTableResource);
            return temp1;
        }

        public string Edit(string Id, FormCollection collection)
        {
            string _pathLoad = ResourceHelper.PathResourceResolver(Id, "App_LocalResources");

            List<LangName> _langName = ResourceHelper.ReadResourceFile(_pathLoad);
            string tempJsonDataTableResource = ResourceHelper.ParceToJSONMethod(_langName);

            return tempJsonDataTableResource;
        }

    }
}
