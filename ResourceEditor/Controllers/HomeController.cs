using ResourceEditor.Entities;
using ResourceEditor.Models;
using System.Collections.Generic;
using System.Web.Mvc;

namespace ResourceEditor.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public bool Delete(LangName rowDelete, string Id)
        {
            string _pathSave = ResourceHelper.GetPath(Id);
            string result = default;
            ViewBag.result = $"{result}"; //???

            return ResourceHelper.Delete(_pathSave, rowDelete, out result);
        }
        public bool Update(LangName rowUpdate, string Id)
        {
            if (ModelState.IsValid)
            {
                string _pathSave = ResourceHelper.GetPath(Id);

                return ResourceHelper.Update(_pathSave, rowUpdate);
            }
            else
            {
                return false;
            }
        }

        public bool Insert(List<LangName> list, string Id)
        {
            string _pathSave = ResourceHelper.GetPath(Id);

            if (list == null) return false;

            return ResourceHelper.Insert(_pathSave, list);
        }

        public ActionResult Read(List<LangName> list, string Id)
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