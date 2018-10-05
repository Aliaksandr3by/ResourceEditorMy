using ResourceEditor.Entities;
using ResourceEditor.Models;
using System.Collections.Generic;
using System.Web.Mvc;

namespace ResourceEditor.Controllers
{
    public class HomeController : Controller
    {
        //TODO rename Id to id
        [HttpPost]
        public bool Delete(LangName list, string Id)
        {
            string _pathSave = ResourceHelper.GetPath(Id);

            string result = default;
            ViewBag.result = $"{result}"; //???

            return ResourceHelper.Delete(_pathSave, list, out result);
        }

        public ActionResult Insert(List<LangName> list, string Id)
        {
            string _pathSave = ResourceHelper.GetPath(Id);

            if (list != null) ResourceHelper.Insert(_pathSave, list);

            return View("Read");
        }

        public ActionResult Read(List<LangName> list, string Id)
        {
            string _pathSave = ResourceHelper.GetPath(Id);

            List<LangName> _langName = ResourceHelper.Read(_pathSave);

            return View("Read", _langName);
        }
        public ActionResult Update(List<LangName> list, string Id)
        {
            string _pathSave = ResourceHelper.GetPath(Id);

            List<LangName> _langName = ResourceHelper.Read(_pathSave);

            return View("Read", _langName);
        }

        public PartialViewResult Switch(List<LangName> list, string Id)
        {
            string _pathSave = ResourceHelper.GetPath(Id);

            List<LangName> _langName = ResourceHelper.Read(_pathSave);

            return PartialView("UpdateData", _langName);
        }
    }
}