using System.Web;
using System.Web.Optimization;

namespace ResourceEditor
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include("~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include("~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include("~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include("~/Scripts/bootstrap.js"));

            bundles.Add(new ScriptBundle("~/bundles/Kendo").Include(
                "~/Scripts/Kendo/kendo.all.min.js",
                "~/Scripts/Kendo/kendo.aspnetmvc.min"
                ));

            bundles.Add(new ScriptBundle("~/bundles/main").Include("~/Scripts/main.js")); 
            bundles.Add(new ScriptBundle("~/bundles/products").Include("~/Scripts/products.js")); 

            bundles.Add(new StyleBundle("~/Content/Kendocommon").Include("~/Content/kendo.common.min.css"));
            bundles.Add(new StyleBundle("~/Content/Kendotheme").Include("~/Content/kendo.theme.min.css"));
            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/bootstrap.css","~/Content/site.css"));

        }
    }
}
