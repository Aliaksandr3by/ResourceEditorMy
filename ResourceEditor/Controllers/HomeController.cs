using Newtonsoft.Json;
using ResourceEditor.Entities;
using ResourceEditor.Models;
using System.Collections;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;
using System.Linq;

namespace ResourceEditor.Controllers
{
    public class HomeController : Controller
    {

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult UploadFile(IEnumerable<HttpPostedFileBase> uploads)
        {
            foreach (var upload in uploads)
            {
                if (upload != null)
                {
                    upload.SaveAs(Server.MapPath("~/App_LocalResources/" + upload.FileName)); //файл перезаписывается
                    ResourceEditor.Managers.XmlManager.SetLang(upload.FileName);
                }
                else
                {
                    return Json(new { result = "File was not saved!", error = "upload is NUll" });
                }
            }

            return Json(new { result = "File saved!", fileName = string.Join(", ", uploads.Select(x => x.FileName)) });
        }
        
        public FileResult GetFile(string Language)
        {
            string file_path = ResourceHelper.GetPath(Language);
            string file_type = "application/xml";
            string file_name = System.IO.Path.GetFileName(file_path);
            return File(file_path, file_type, file_name);
        }

        [HttpPost]
        public ActionResult DataProtect(LangName itemExists, string Language)
        {
            string _pathSave = ResourceHelper.GetPath(Language);
            var result = ResourceHelper.DataProtect(_pathSave, itemExists);
            if (result != null)
            {
                return Json(result);
            }
            else
            {
                return null;
            }
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