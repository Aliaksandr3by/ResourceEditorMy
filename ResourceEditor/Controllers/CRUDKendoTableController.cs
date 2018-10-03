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

        public string Read(string Id)
        {
            string _pathLoad = ResourceHelper.PathResourceResolver(Id, "App_LocalResources");

            List<LangName> _langName = ResourceHelper.ReadResourceFile(_pathLoad);
            string tempJsonDataTableResource = ResourceHelper.ParceToJSONMethod(_langName);

            return tempJsonDataTableResource;
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
