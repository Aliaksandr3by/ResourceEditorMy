// --------------------------------------------------------------------------------------------------------------------
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

    public class AllowCrossSiteJsonAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var ctx = filterContext.RequestContext.HttpContext;
            var origin = ctx.Request.Headers["Origin"];
            var allowOrigin = !string.IsNullOrWhiteSpace(origin) ? origin : "*";
            ctx.Response.AddHeader("Access-Control-Allow-Origin", allowOrigin);
            ctx.Response.AddHeader("Access-Control-Allow-Headers", "*");
            ctx.Response.AddHeader("Access-Control-Allow-Methods", "*");
            ctx.Response.AddHeader("Access-Control-Allow-Credentials", "false");
            base.OnActionExecuting(filterContext);
        }
    }
    public class ContentTypeAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            //filterContext.RequestContext.HttpContext.Response.AddHeader("Content-Type", "application/json;charset=UTF-8");
            //filterContext.RequestContext.HttpContext.Response.AddHeader("Content-Type", "application/xml;charset=UTF-8");
            //filterContext.RequestContext.HttpContext.Response.AddHeader("Content-Type", "text/html;charset=UTF-8");
            filterContext.RequestContext.HttpContext.Response.AddHeader("Content-Type", "text/plain;charset=UTF-8");
            base.OnActionExecuting(filterContext);
        }
    }

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
        [AllowCrossSiteJson]
        [ContentType]
        public ActionResult SwitchLanguage(string language, string sort, string filter)
        {
            var pathSave = ResourceHelper.GetPath(language);

            var result = (pathSave == null) 
                ? this.Json(new { error = "File was not found" }) 
                : this.Json(ResourceHelper.Read(pathSave, sort, filter));

            return result;
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
            var selectCountry = ResourceEditor.Managers.XmlManager.GetLanguages();

            return this.Json(selectCountry);
        }
    }
}