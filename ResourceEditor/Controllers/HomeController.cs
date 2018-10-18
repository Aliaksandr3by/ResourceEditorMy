﻿// --------------------------------------------------------------------------------------------------------------------
// <copyright file="HomeController.cs" company="Alex">
//   free
// </copyright>
// <summary>
//   Defines the HomeController type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace ResourceEditor.Controllers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;

    using ResourceEditor.Entities;
    using ResourceEditor.Models;

    /// <inheritdoc />
    /// <summary>
    /// The home controller.
    /// </summary>
    public class HomeController : Controller
    {
        /// <summary>
        /// The index.
        /// </summary>
        /// <returns>
        /// The <see cref="ActionResult"/>.
        /// </returns>
        public ActionResult Index()
        {
            return this.View();
        }

        /// <summary>
        /// The select country.
        /// </summary>
        /// <returns>
        /// The <see cref="ActionResult"/>.
        /// </returns>
        [HttpPost]
        public ActionResult SelectCountry()
        {
            return this.PartialView();
        }

        /// <summary>
        /// The upload file.
        /// </summary>
        /// <param name="uploads">
        /// The uploads.
        /// </param>
        /// <returns>
        /// The <see cref="ActionResult"/>.
        /// </returns>
        [HttpPost]
        public ActionResult UploadFile(IEnumerable<HttpPostedFileBase> uploads)
        {
            if (uploads == null)
            {
                return this.Json(new { error = "File was not found!" });
            }

            var httpPostedFileBases = uploads as HttpPostedFileBase[] ?? uploads.ToArray();

            foreach (var upload in httpPostedFileBases)
            {
                if (upload != null)
                {
                    upload.SaveAs(this.Server.MapPath("~/App_LocalResources/" + upload.FileName));
                    Managers.XmlManager.SetLang(upload.FileName);
                }
                else
                {
                    return this.Json(new { result = "File was not saved!", error = "upload is NUll" });//обрыв если хоть один файл не загрузился
                }
            }

            return this.Json(new { result = "File saved!", fileName = string.Join(", ", httpPostedFileBases.Select(x => x.FileName)) });
        }

        /// <summary>
        /// The get file.
        /// </summary>
        /// <param name="language">
        /// The language.
        /// </param>
        /// <returns>
        /// The <see cref="FileResult"/>.
        /// </returns>
        public FileResult GetFile(string language)
        {
            var pathSave = ResourceHelper.GetPath(language);
            if (System.IO.File.Exists(pathSave))
            {
                var fileType = "application/xml";
                var fileName = System.IO.Path.GetFileName(pathSave);
                return this.File(pathSave, fileType, fileName);
            }

            return null;
        }

        /// <summary>
        /// The data protect.
        /// </summary>
        /// <param name="itemExists">
        /// The item exists.
        /// </param>
        /// <param name="language">
        /// The language.
        /// </param>
        /// <returns>
        /// The <see cref="ActionResult"/>.
        /// </returns>
        [HttpPost]
        public ActionResult DataProtect(LangName itemExists, string language)
        {
            var pathSave = ResourceHelper.GetPath(language);

            var result = ResourceHelper.DataProtect(pathSave, itemExists);

            if (result != null)
            {
                return this.Json(result);
            }
            else
            {
                return this.Json(new { status = $"{itemExists.Id} was not found!" });
            }
        }

        /// <summary>
        /// The read.
        /// </summary>
        /// <param name="list">
        /// The rowInsert.
        /// </param>
        /// <param name="language">
        /// The language.
        /// </param>
        /// <returns>
        /// The <see cref="ActionResult"/>.
        /// </returns>
        public ActionResult Read(List<LangName> list, string language)
        {
            var pathSave = ResourceHelper.GetPath(language);

            var langName = ResourceHelper.Read(pathSave);

            return this.View("Read", langName);
        }

        /// <summary>
        /// The delete.
        /// </summary>
        /// <param name="rowDelete">
        /// The row delete.
        /// </param>
        /// <param name="language">
        /// The language.
        /// </param>
        /// <returns>
        /// The <see cref="ActionResult"/>.
        /// </returns>
        [HttpPost]
        public ActionResult Delete(LangName rowDelete, string language)
        {
            var pathSave = ResourceHelper.GetPath(language);

            return this.Json(ResourceHelper.Delete(pathSave, rowDelete));
        }

        /// <summary>
        /// The update.
        /// </summary>
        /// <param name="rowUpdate">
        /// The row update.
        /// </param>
        /// <param name="language">
        /// The language.
        /// </param>
        /// <returns>
        /// The <see cref="ActionResult"/>.
        /// </returns>
        [HttpPost]
        public ActionResult Update(LangName rowUpdate, string language)
        {
            if (this.ModelState.IsValid)
            {
                var pathSave = ResourceHelper.GetPath(language);
                if (ResourceHelper.DataProtect(pathSave, rowUpdate) != null)
                {
                    ResourceHelper.Update(pathSave, rowUpdate);
                    return this.Json(new { status = "Update" });
                }
                else
                {
                    ResourceHelper.Insert(pathSave, rowUpdate);
                    return this.Json(new { status = "Insert" });
                }
            }

            var errors = new List<string>();

            foreach (var modelStateVal in this.ViewData.ModelState.Values)
            {
                errors.AddRange(modelStateVal.Errors.Select(error => error.ErrorMessage));
            }

            return this.Json(new { status = "validation-error", error = errors });
        }

        /// <summary>
        /// The insert.
        /// </summary>
        /// <param name="rowInsert">
        /// The rowInsert.
        /// </param>
        /// <param name="language">
        /// The language.
        /// </param>
        /// <returns>
        /// The <see cref="ActionResult"/>.
        /// </returns>
        [HttpPost]
        public ActionResult Insert(LangName rowInsert, string language)
        {
            var pathSave = ResourceHelper.GetPath(language);

            return rowInsert != null ? this.Json(ResourceHelper.Insert(pathSave, rowInsert)) : null;
        }

        /// <summary>
        /// The switch.
        /// </summary>
        /// <param name="language">
        /// The language.
        /// </param>
        /// <returns>
        /// The <see cref="ActionResult"/>.
        /// </returns>
        [HttpPost]
        public ActionResult Switch(string language)
        {
            var pathSave = ResourceHelper.GetPath(language);

            return this.Json(ResourceHelper.Read(pathSave));
        }
    }
}