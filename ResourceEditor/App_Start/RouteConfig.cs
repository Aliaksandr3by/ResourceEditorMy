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
                name: "Shared",
                url: "Shared/{action}/{id}",
                defaults: new { controller = "Shared", action = "MainTableResource", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "AddLineResource", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "MainTableResourceRoute",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "MainTableResource", id = UrlParameter.Optional }
            );
           
        }
    }
}
