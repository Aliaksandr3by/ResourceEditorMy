using Newtonsoft.Json;
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

        public ActionResult Read(List<LangName> list, string Language)
        {
            string _pathSave = ResourceHelper.GetPath(Language);

            List<LangName> _langName = ResourceHelper.Read(_pathSave);

            return View("Read", _langName);
        }

        [HttpPost]
        public ActionResult Delete(LangName rowDelete, string Language)
        {
            string _pathSave = ResourceHelper.GetPath(Language);
            string result = default;
            ViewBag.result = $"{result}"; //???

            return Json(ResourceHelper.Delete(_pathSave, rowDelete, out result));
        }

        [HttpPost]
        public ActionResult Update(LangName rowUpdate, string Language)
        {
            if (ModelState.IsValid)
            {
                string _pathSave = ResourceHelper.GetPath(Language);
                var tmp = ResourceHelper.Update(_pathSave, rowUpdate);
                var tmpJson = JsonConvert.SerializeObject((ResourceHelper.Update(_pathSave, rowUpdate)));
                return Json(tmp);
            }
            else
            {
                return null;
            }
        }

        [HttpPost]
        public ActionResult Insert(List<LangName> list, string Language)
        {
            string _pathSave = ResourceHelper.GetPath(Language);

            if (list != null)
            {
                return Json(ResourceHelper.Insert(_pathSave, list));
            }

            return null;
        }

        [HttpPost]
        public ActionResult Switch(string Language)
        {
            string _pathSave = ResourceHelper.GetPath(Language);

            return Json(ResourceHelper.Read(_pathSave));
        }
    }
}