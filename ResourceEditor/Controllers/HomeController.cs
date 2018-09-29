using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ResourceEditor.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {


            return View();
        }

        public ActionResult Data()
        {
            List<string> cultures = new List<string>() { "ru", "en", "pl" };
            string cultureName = "pl";
            ResourceEditor.App_LocalResources.Resource.Culture = new CultureInfo(cultureName);
            ViewBag.cult = ResourceEditor.App_LocalResources.Resource.q1;
            return View();
        }


    }
}