using System.Web;
using System.Web.Optimization;

namespace ResourceEditor
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.UseCdn = true;   //enable CDN support

            bundles.Add(new ScriptBundle("~/bundles/materialize-css").Include(
                "~/node_modules/materialize-css/dist/js/materialize.js"));

            /*JS*/
            bundles.Add(new ScriptBundle("~/bundles/jquery", @"https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js").Include(
                "~/node_modules/jquery/dist/jquery.js",
                "~/node_modules/jquery.cookie/jquery.cookie.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                "~/node_modules/jquery-validation/dist/jquery.validate.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryvalunob").Include(
                "~/node_modules/jquery-validation-unobtrusive/dist/jquery.validate.unobtrusive.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                "~/node_modules/bootstrap/dist/js/bootstrap.js"));

            bundles.Add(new Bundle("~/bundles/main").Include("~/src/main.js")); //неверная минификация

            /*CSS*/

            bundles.Add(new StyleBundle("~/Content/materialize-css").Include(
                "~/node_modules/materialize-css/dist/css/materialize.css"));

            bundles.Add(new StyleBundle("~/Content/bootstrap").Include(
                "~/node_modules/bootstrap/dist/css/bootstrap.css"));

            bundles.Add(new StyleBundle("~/Content/site").Include(
                "~/Content/site.css"));

            // Code removed for clarity.
            //BundleTable.EnableOptimizations = false;
        }
    }
}
