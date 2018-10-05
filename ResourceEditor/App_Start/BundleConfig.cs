using System.Web;
using System.Web.Optimization;

namespace ResourceEditor
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include("~/node_modules/jquery/dist/jquery.js"));
            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include("~/node_modules/jquery-validation/dist/jquery.validate.js"));
            bundles.Add(new ScriptBundle("~/bundles/jqueryvalunob").Include("~/node_modules/jquery-validation-unobtrusive/dist/jquery.validate.unobtrusive.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include("~/node_modules/bootstrap/dist/js/bootstrap.js"));

            bundles.Add(new ScriptBundle("~/bundles/Kendo").Include("~/node_modules/kendo-ui-core/js/kendo.core.js"));

            bundles.Add(new ScriptBundle("~/bundles/main").Include("~/Scripts/main.js")); 

            bundles.Add(new StyleBundle("~/Content/bootstrap").Include("~/node_modules/bootstrap/dist/css/bootstrap.css"));

            bundles.Add(new StyleBundle("~/Content/Kendo").Include("~/node_modules/kendo-ui-core/css/web/kendo.default.css"));

            bundles.Add(new StyleBundle("~/Content/site").Include("~/Content/site.css"));

        }
    }
}
