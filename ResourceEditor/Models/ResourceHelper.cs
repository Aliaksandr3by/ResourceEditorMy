using ResourceEditor.Entities;
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
                _file = $"Resource.{id}.resx";
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
        /// <returns>Edited data</returns>
        public static List<LangName> Read(string pathLoad)
        {
            List<LangName> outLangNames = new List<LangName>();
            using (ResXResourceReader rr = new ResXResourceReader(pathLoad))
            {
                rr.UseResXDataNodes = true; //makes a comment resource item available
                IDictionaryEnumerator dict = rr.GetEnumerator();
                while (dict.MoveNext())
                {
                    ResXDataNode node = (ResXDataNode)dict.Value;
                    AssemblyName[] assemblies = Assembly.GetExecutingAssembly().GetReferencedAssemblies(); //i do`t know
                    outLangNames.Add(
                        new LangName
                        {
                            Id = node.Name,
                            Value = node.GetValue(assemblies).ToString() ?? null,
                            Comment = !String.IsNullOrEmpty(node.Comment) ? node.Comment : ""
                        });
                }
            }
            return outLangNames.OrderBy(e => e.Id).ToList();
        }

        /// <summary>
        /// This method create a Node element of resourse file
        /// </summary>
        /// <param name="rw">Object ResXDataNode</param>
        /// <param name="id">id</param>
        /// <param name="value">value</param>
        /// <param name="comment">comment</param>
        /// <returns></returns>
        private static ResXDataNode _createNodeElement(ResXResourceWriter rw, string id, string value, string comment = "")
        {
            if (!string.IsNullOrWhiteSpace(id))
            {
                ResXDataNode _node = new ResXDataNode(id, value)
                {
                    Comment = comment
                };
                return _node;
            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// This method need to create a ResX file
        /// </summary>
        /// <param name="langName">Object with data</param>
        /// <param name="pathSave">path save Resx</param>
        public static bool Create(string pathSave, List<LangName> langName)
        {
            if (langName != null)
            {
                using (ResXResourceWriter rw = new ResXResourceWriter(pathSave))
                {
                    for (int ctr = 0; ctr < langName.Count; ctr++)
                    {
                        if (!string.IsNullOrWhiteSpace(langName[ctr].Id))
                        {
                            var node = _createNodeElement(rw, langName[ctr].Id, langName[ctr].Value, langName[ctr].Comment);
                            if (node != null)
                            {
                                rw.AddResource(node);
                            }
                        }
                    }
                    rw.Generate();
                    return true;
                }
            }
            else
            {
                return false;
            }
        }

        /// <summary>
        /// This method need to update Resx
        /// </summary>
        /// <param name="pathSave">path load/save a Resx file</param>
        /// <param name="updateElement">Object with data</param>
        /// <param name="StatusUpdate">error status</param>
        public static IEnumerable<LangName> Update(string pathSave, LangName updateElement)
        {
            List<LangName> originalElement = ResourceHelper.Read(pathSave);

            int _index = originalElement.FindIndex((e) => e.Id == updateElement.Id);

            if (_index >= 0)
            {
                originalElement[_index] = updateElement;
                ResourceHelper.Create(pathSave, originalElement);
                return originalElement;
            }
            else
            {
                ResourceHelper.Insert(pathSave, new List<LangName>() { updateElement });
                return originalElement;
            }


        }

        public static IEnumerable<LangName> Insert(string pathSave, List<LangName> newItemList)
        {
            List<LangName> originalElement = default;
            if (newItemList != null)
            {
                originalElement = ResourceHelper.Read(pathSave);
                originalElement.AddRange(newItemList);
                ResourceHelper.Create(pathSave, originalElement);
            }

            return originalElement;
        }

        //test
        public static string[] DeleteAllEntitiesEN(LangName deleteElement, string pathSave = "App_LocalResources", string file = "Resource.resx")
        {
            //exclude Resource.resx
            string[] allFoundFiles = Directory.GetFiles(
                System.Web.Hosting.HostingEnvironment.MapPath($"~/{pathSave}/"), "Resource.*.resx", SearchOption.AllDirectories);
            string result = default;
            foreach (var item in allFoundFiles)
            {
                if (file != Path.GetFileName(item))
                {
                    ResourceHelper.Delete(item, deleteElement, out result);
                }
            }

            return allFoundFiles;
        }

        /// <summary>
        /// This method need for delete node in Resx file
        /// </summary>
        /// <param name="pathSave">Path save file</param>
        /// <param name="deleteElementID">Deleted item ID</param>
        /// <returns>Update collection</returns>
        public static IEnumerable<LangName> Delete(string pathSave, LangName langNameID, out string messageResult)
        {
            List<LangName> originalElement = ResourceHelper.Read(pathSave);

            try
            {
                int _index = originalElement.FindIndex((e) => e.Id == langNameID.Id);

                if (_index >= 0)
                {
                    originalElement.RemoveAt(_index);
                    ResourceHelper.Create(pathSave, originalElement);
                }

                if (pathSave.Contains("Resource.resx"))
                {
                    if (DeleteAllEntitiesEN(langNameID) == null)
                    {
                        messageResult = "unknown error";
                        return originalElement;
                    }
                }

                messageResult = $"Delete {langNameID.Id} - {langNameID.Value} is complete";

                return originalElement;
            }
            catch (ArgumentOutOfRangeException ex)
            {
                messageResult = ex.Message;
                return null;
            }
            catch (Exception ex)
            {
                messageResult = ex.Message;
                return null;
            }   
        }

        /// <summary>
        /// This method need to parse collection object to JSON format
        /// </summary>
        /// <param name="langNames"></param>
        /// <returns></returns>
        public static string ParceToJSON(List<LangName> langNames)
        {
            StringBuilder stringBuilder = new StringBuilder();
            JavaScriptSerializer serializer = new JavaScriptSerializer();

            var _tempLangname = langNames.Select(x => serializer.Serialize(x));
            stringBuilder.Append(string.Join(",", _tempLangname));

            return $"[{stringBuilder}]";
        }
    }
}