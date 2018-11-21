using System.Web;
using System.Web.Optimization;

namespace ResourceEditor
{
    /*
        @Scripts.Render("~/bundles/jquery")
        @Scripts.Render("~/bundles/jqueryval")
        @Scripts.Render("~/bundles/jqueryvalunob")

        @Scripts.Render("~/bundles/popper")
        @Scripts.Render("~/bundles/bootstrap")
        @Scripts.Render("~/bundles/main")

        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        @Styles.Render("~/Content/materialize")
        @Scripts.Render("~/bundles/materialize")

    */
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            /*JS*/

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                "~/node_modules/jquery/dist/jquery.js",
                "~/node_modules/jquery.cookie/jquery.cookie.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include("~/node_modules/jquery-validation/dist/jquery.validate.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryvalunob").Include("~/node_modules/jquery-validation-unobtrusive/dist/jquery.validate.unobtrusive.js"));

            bundles.Add(new Bundle("~/bundles/popper").Include("~/node_modules/popper.js/dist/popper.js"));

            bundles.Add(new Bundle("~/bundles/bootstrap").Include("~/node_modules/bootstrap/dist/js/bootstrap.js"));


            bundles.Add(new ScriptBundle("~/bundles/materialize").Include("~/node_modules/materialize-css/dist/js/materialize.js"));


            bundles.Add(new Bundle("~/bundles/main").Include("~/src/main.js")); //неверная минификация main.js
            bundles.Add(new Bundle("~/bundles/bundle").Include("~/src/bundle.js")); //неверная минификация main.js


            /*CSS*/

            bundles.Add(new StyleBundle("~/Content/bootstrap").Include("~/node_modules/bootstrap/dist/css/bootstrap.min.css"));

            bundles.Add(new StyleBundle("~/Content/materialize").Include("~/node_modules/materialize-css/dist/css/materialize.css"));

            bundles.Add(new StyleBundle("~/Content/site").Include("~/Content/site.css"));

            // Code removed for clarity.
            //BundleTable.EnableOptimizations = false;
        }
    }
}
