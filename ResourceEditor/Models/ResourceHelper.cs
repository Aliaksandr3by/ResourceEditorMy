﻿using System;
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
        public static string StatusUpdate = default(string);

        /// <summary>
        /// This method allows to get the path to save the Resource file
        /// </summary>
        /// <param name="id">id country in name file "Resource.*.resx", example "be", if this parameter equalce null, default "en"</param>
        /// <param name="pathSave">Directory lode/save *.resx file, default "App_LocalResources"</param>
        /// <returns></returns>
        public static string GetPath(string id = null, string pathSave = "App_LocalResources")
        {
            string _file = default(string); //name file

            if (string.IsNullOrWhiteSpace(id))
            {
                _file = "Resource.resx";
            }
            else
            {
                _file = "Resource.{id}.resx";
            }

            string[] allFoundFiles = Directory.GetFiles(
                System.Web.Hosting.HostingEnvironment.MapPath($"~/{pathSave}/"),
                _file, 
                SearchOption.AllDirectories
                );
 
            return allFoundFiles.FirstOrDefault();
        }

        /// <summary>
        /// Get all the data from the file
        /// </summary>
        /// <param name="pathLoad">Full path by explore file</param>
        /// <returns></returns>
        public static List<LangName> GetAll(string pathLoad)
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
        /// This method create a Node element of resourse file
        /// </summary>
        /// <param name="rw">Object ResXDataNode</param>
        /// <param name="id">id</param>
        /// <param name="value">value</param>
        /// <param name="comment">comment</param>
        private static void _createNodeElement(ResXResourceWriter rw, string id, string value, string comment)
        {
            ResXDataNode _node = new ResXDataNode(id, value)
            {
                Comment = comment
            };
            rw.AddResource(_node);
        }

        /// <summary>
        /// This method need to create a ResX file
        /// </summary>
        /// <param name="langName">Object with data</param>
        /// <param name="pathSave">path save Resx</param>
        public static void CreateResource(List<LangName> langName, string pathSave)
        {
            using (ResXResourceWriter rw = new ResXResourceWriter(pathSave))
            {
                for (int ctr = 0; ctr < langName.Count; ctr++)
                {
                    ResXDataNode node = new ResXDataNode(langName[ctr].Id, langName[ctr].Value);
                    node.Comment = langName[ctr].Comment;
                    rw.AddResource(node);
                }
                rw.Generate();
                //rw.Close();
            }
        }

        /// <summary>
        /// This method need to update Resx
        /// </summary>
        /// <param name="pathSave">path load/save a Resx file</param>
        /// <param name="updateElement">Object with data</param>
        /// <param name="StatusUpdate">error status</param>
        public static List<LangName> UpdateResource(string pathSave, List<LangName> updateElement, out string StatusUpdate)
        {
            List<LangName> originalElement = ResourceHelper.GetAll(pathSave); //метод зависит от внешнего метода

            try
            {
                using (ResXResourceWriter rw = new ResXResourceWriter(pathSave))
                {
                    int _index = default(int);
                    for (int i = 0; i < updateElement.Count; i++)
                    {
                        _index = originalElement.FindIndex((e) => e.Id == updateElement[i].Id);
                        if (_index >= 0)
                        {
                            originalElement[_index] = updateElement[i];
                            _createNodeElement(rw, originalElement[i].Id, originalElement[i].Value, originalElement[i].Comment);
                        }
                    }
                    rw.Generate();
                    StatusUpdate = "";
                }
            }
            catch (ArgumentNullException ex)
            {
                StatusUpdate = ex.Message;
            }

            return originalElement;
        }

        /// <summary>
        /// Create, update & delete
        /// </summary>
        /// <param name="langName"></param>
        /// <param name="pathSave"></param>
        /// <param name="langNameAdd"></param>
        /// <param name="idDeleteLineResource">delete of ID</param>
        [Obsolete("The method is better not to use")]
        public static void CreateResourceFile(List<LangName> langName, string pathSave, List<LangName> langNameAdd = null, string idDeleteLineResource = null)
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
                        if (item.Id != null)
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
            stringBuilder.Append(string.Join(",", a));


            foreach (var item in langNames)
            {
                jSonlangname += serializer.Serialize(item) + ",";
            }

            jSonlangname = jSonlangname.TrimEnd(',');

            return $"[{jSonlangname}]";
        }
    }
}