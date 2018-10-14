using Newtonsoft.Json;
using ResourceEditor.Entities;
using ResourceEditor.Models;
using System.Collections;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;
using System.Linq;
using System.IO;

namespace ResourceEditor.Controllers
{
    public class HomeController : Controller
    {

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult SelectCountry()
        {


            return PartialView();
        }

        [HttpPost]
        public ActionResult UploadFile(IEnumerable<HttpPostedFileBase> uploads)
        {
            if (uploads != null)
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
            return Json(new { error = $"File was not found!" });
        }
        
        public FileResult GetFile(string Language)
        {
            string _pathSave = ResourceHelper.GetPath(Language);
            if (System.IO.File.Exists(_pathSave))
            {
                string _fileType = "application/xml";
                string _fileName = System.IO.Path.GetFileName(_pathSave);
                return File(_pathSave, _fileType, _fileName);
            }
            else
            {
                return null;
            }
        }

        [HttpPost]
        public ActionResult DataProtect(LangName itemExists, string Language)
        {
            string _pathSave = ResourceHelper.GetPath(Language);
            if (System.IO.File.Exists(_pathSave))
            {
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
            else
            {
                return Json(new { error = $"{System.IO.Path.GetFileName(_pathSave)} was not found!" });
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
                if (System.IO.File.Exists(_pathSave))
                {
                    return Json(ResourceHelper.Update(_pathSave, rowUpdate));
                }
                else
                {
                    return Json(new { error = System.IO.Path.GetFileName(_pathSave) + " was not found!"});
                }
            }
            else
            {
                return Json(new { error = "ModelState inValid" });
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