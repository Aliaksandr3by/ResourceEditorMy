using System.Web;
using System.Web.Optimization;

namespace ResourceEditor
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            /*JS*/
            Bundle jqueryBundle = new ScriptBundle("~/bundles/jquery");
            jqueryBundle.Include("~/node_modules/jquery/dist/jquery.js");
            jqueryBundle.CdnFallbackExpression = @"~/node_modules/jquery/dist/jquery.js";
            jqueryBundle.CdnPath = @"https://code.jquery.com/jquery-3.3.1.js";
            bundles.Add(jqueryBundle);

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include("~/node_modules/jquery-validation/dist/jquery.validate.js"));
            bundles.Add(new ScriptBundle("~/bundles/jqueryvalunob").Include("~/node_modules/jquery-validation-unobtrusive/dist/jquery.validate.unobtrusive.js"));
            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include("~/node_modules/bootstrap/dist/js/bootstrap.js"));
            bundles.Add(new ScriptBundle("~/bundles/main").Include("~/Scripts/main.js"));

            Bundle kendoUIBundle = new ScriptBundle("~/bundles/kendoUI");
            kendoUIBundle.CdnPath = @"http://kendo.cdn.telerik.com/2014.1.318/js/kendo.all.min.js";
            kendoUIBundle.Include("~/Scripts/kendo/2014.1.318/kendo.web.min.js");
            bundles.Add(kendoUIBundle);

            /*CSS*/
            bundles.Add(new StyleBundle("~/Content/bootstrap").Include("~/node_modules/bootstrap/dist/css/bootstrap.css"));

            bundles.Add(new StyleBundle("~/Content/kendoUI").Include(
                "~/Content/kendo/2014.1.318/kendo.common.min.css",
                "~/Content/kendo/2014.1.318/kendo.bootstrap.min.css"
                ));

            bundles.Add(new StyleBundle("~/Content/site").Include("~/Content/site.css"));
        }
    }
}
