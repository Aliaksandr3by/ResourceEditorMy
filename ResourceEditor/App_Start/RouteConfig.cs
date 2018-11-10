// --------------------------------------------------------------------------------------------------------------------
// <copyright file="RouteConfig.cs" company="Alex">
//   free
// </copyright>
// <summary>
//   Defines the RouteConfig type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace ResourceEditor
{
    using System.Web.Mvc;
    using System.Web.Routing;

    /// <summary>
    /// Route apl
    /// </summary>
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional });

            routes.MapRoute(
                name: "HomeRead",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Read", id = UrlParameter.Optional });

            routes.MapRoute(
                name: "HomeInsert",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Insert", id = UrlParameter.Optional });

            routes.MapRoute(
                name: "HomeUpdate",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Update", id = UrlParameter.Optional });

            routes.MapRoute(
                name: "HomeDelete",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Delete", id = UrlParameter.Optional });

            routes.MapRoute(
                name: "HomeSelectCountry",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "SelectCountry", id = UrlParameter.Optional });

            routes.MapRoute(
                name: "HomeSwitchLanguage",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "SwitchLanguage", id = UrlParameter.Optional });
        }
    }
}
