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
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "HomeRead",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Read", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "HomeInsert",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Insert", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "HomeUpdate",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Update", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "HomeDelete",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Delete", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "HomeSelectCountry",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "SelectCountry", id = UrlParameter.Optional }
            );
            

        }
    }
}
