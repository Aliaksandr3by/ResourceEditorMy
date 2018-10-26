using React;
using JavaScriptEngineSwitcher.Core;
using JavaScriptEngineSwitcher.V8;

[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(ResourceEditor.ReactConfig), "Configure")]

namespace ResourceEditor
{
    public static class ReactConfig
    {
        public static void Configure()
        {
            ReactSiteConfiguration.Configuration.AddScript("~/Content/Sample.jsx");

            JsEngineSwitcher.Instance.DefaultEngineName = V8JsEngine.EngineName;
            JsEngineSwitcher.Instance.EngineFactories.AddV8();
        }
    }
}