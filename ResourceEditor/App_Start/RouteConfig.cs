using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace ResourceEditor
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "addLineResource", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "DataRoute",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Data", id = UrlParameter.Optional }
            );
           
        }
    }
}
