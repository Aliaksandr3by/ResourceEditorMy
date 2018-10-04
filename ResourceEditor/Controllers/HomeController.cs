using ResourceEditor.Models;
using System.Collections.Generic;
using System.Web.Mvc;

namespace ResourceEditor.Controllers
{
    public class HomeController : Controller
    {
        //TODO rename Id to id
        public ActionResult DeleteLineResource(string Id, string idDeleteElement)
        {
            string _pathSave = ResourceHelper.GetPath(Id);

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