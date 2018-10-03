using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Resources;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;

namespace ResourceEditor.Models
{
    public class ResourceHelper
    {
        public static string PathResourceResolver(string id, string pathSave)
        {
            string _pathSave = null;
            if (string.IsNullOrWhiteSpace(id))
            {
                _pathSave = System.Web.Hosting.HostingEnvironment.MapPath($"~/{pathSave}/Resource.resx");
            }
            else
            {
                _pathSave = System.Web.Hosting.HostingEnvironment.MapPath($"~/{pathSave}/Resource.{id}.resx");
            }
            return _pathSave;
        }

        public static List<LangName> ReadResourceFile(string pathLoad)
        {
            List<LangName> outLangNames = new List<LangName>();
            using (ResXResourceReader rr = new ResXResourceReader(pathLoad))
            {
                rr.UseResXDataNodes = true; //делает элемент ресурса комментарий доступным
                IDictionaryEnumerator dict = rr.GetEnumerator();
                while (dict.MoveNext())
                {
                    ResXDataNode node = (ResXDataNode)dict.Value;
                    AssemblyName[] assemblies = Assembly.GetExecutingAssembly().GetReferencedAssemblies();
                    outLangNames.Add(
                        new LangName
                        {
                            Id = node.Name,
                            Value = node.GetValue(assemblies).ToString() ?? null,
                            Comment = !String.IsNullOrEmpty(node.Comment) ? node.Comment : ""
                        });
                }
            }
            return outLangNames;
        }

        /// <summary>
        /// Create, update & delete
        /// </summary>
        /// <param name="langName"></param>
        /// <param name="pathSave"></param>
        /// <param name="langNameAdd"></param>
        /// <param name="idDeleteLineResource">delete of ID</param>
        public static void CreateResourceFile(List<LangName> langName,string pathSave,List<LangName> langNameAdd = null, string idDeleteLineResource = null)
        {
            using (ResXResourceWriter rw = new ResXResourceWriter(pathSave))
            {
                for (int ctr = 0; ctr < langName.Count; ctr++)
                {
                    //filter for delete line
                    if (idDeleteLineResource != langName[ctr].Id)
                    {
                        ResXDataNode node = new ResXDataNode(langName[ctr].Id, langName[ctr].Value);
                        node.Comment = langName[ctr].Comment;
                        rw.AddResource(node);
                    }
                }

                if (langNameAdd != null)
                {
                    //если ключ существует и иесли запись не добавилась warn
                    foreach (var item in langNameAdd)
                    {
                        //если ID не null , пустое значение допускается (&& item.Value != null)
                        if (item.Id != null )
                        {
                            ResXDataNode nodelangNameOne = new ResXDataNode(item.Id, item.Value)
                            {
                                Comment = item.Comment ?? ""
                            };
                            rw.AddResource(nodelangNameOne);
                        }
                    }
                }

                rw.Generate();
                rw.Close();
            }
        }
        public static string ParceToJSONMethod(List<LangName> langNames)
        {
            string jSonlangname = default(string);

            JavaScriptSerializer serializer = new JavaScriptSerializer();

            StringBuilder stringBuilder = new StringBuilder();
            var a = langNames.Select(x => serializer.Serialize(x));
            stringBuilder.Append(string.Join(",",a ));


            foreach (var item in langNames)
            {
                jSonlangname += serializer.Serialize(item) + ",";
            }

            jSonlangname = jSonlangname.TrimEnd(',');

            return $"[{jSonlangname}]";
        }
    }
}