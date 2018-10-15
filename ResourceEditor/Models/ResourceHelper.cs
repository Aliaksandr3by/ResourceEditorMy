// --------------------------------------------------------------------------------------------------------------------
// <copyright file="ResourceHelper.cs" company="Alex">
//   free
// </copyright>
// <summary>
//   Defines the ResourceHelper type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace ResourceEditor.Models
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Reflection;
    using System.Resources;
    using System.Text;
    using System.Web.Hosting;
    using System.Web.Script.Serialization;

    using ResourceEditor.Entities;

    /// <summary>
    /// Resource Helper
    /// </summary>
    public class ResourceHelper
    {
        /// <summary>
        /// This method checks if the item already exists.
        /// </summary>
        /// <param name="pathLoad">path find</param>
        /// <param name="langName">object lang name</param>
        /// <returns>return result</returns>
        public static LangName DataProtect(string pathLoad, LangName langName)
        {
            var originalElement = Read(pathLoad);

            var result = from item in originalElement where item.Id == langName.Id select item;

            return result.FirstOrDefault();
        }

        /// <summary>
        /// This method allows to get the path to save the Resource file
        /// </summary>
        /// <param name="id">id country in name file "Resource.*.resx", example "be", if this parameter equal null, default "en"</param>
        /// <param name="pathSave">Directory lode/save *.resx file, default "App_LocalResources"</param>
        /// <returns>Full resource path</returns>
        public static string GetPath(string id = null, string pathSave = "App_LocalResources")
        {
            string file;

            if (string.IsNullOrWhiteSpace(id) || id == "en")
            {
                file = "Resource.resx";
            }
            else
            {
                file = $"Resource.{id}.resx";
            }

            var fullPath = HostingEnvironment.MapPath($"~/{pathSave}/") ?? throw new InvalidOperationException();

            var allFoundFiles = Directory.GetFiles(fullPath, file, SearchOption.AllDirectories);

            return allFoundFiles.FirstOrDefault();
        }

        /// <summary>
        /// Get all the data from the file
        /// </summary>
        /// <param name="pathLoad">Full path by explore file</param>
        /// <returns>Edited data</returns>
        public static List<LangName> Read(string pathLoad)
        {
            if (!File.Exists(pathLoad))
            {
                return null;
            }

            var outLangNames = new List<LangName>();

            using (var rr = new ResXResourceReader(pathLoad))
            {
                rr.UseResXDataNodes = true; /*makes a comment resource item available*/
                var dict = rr.GetEnumerator();
                while (dict.MoveNext())
                {
                    var node = (ResXDataNode)dict.Value;
                    var assemblies = Assembly.GetExecutingAssembly().GetReferencedAssemblies(); ////i do`t know
                    outLangNames.Add(
                        new LangName
                            {
                                Id = node.Name,
                                Value = node.GetValue(assemblies).ToString(),
                                Comment = !string.IsNullOrEmpty(node.Comment) ? node.Comment : string.Empty
                            });
                }
            }

            return outLangNames.OrderBy(e => e.Id).ToList();
        }

        /// <summary>
        /// This method create a Node element of resource file
        /// </summary>
        /// <param name="langName">Object of class LangName</param>
        /// <returns>New node item</returns>
        public static ResXDataNode CreateNodeElement(LangName langName)
        {
            if (!string.IsNullOrWhiteSpace(langName.Id) && !string.IsNullOrWhiteSpace(langName.Value))
            {
                return new ResXDataNode(langName.Id, langName.Value) { Comment = langName.Comment };
            }

            return null;
        }

        /// <summary>
        /// This method need to create a ResX file
        /// </summary>
        /// <param name="pathSave">
        /// path save Resx 
        /// </param>
        /// <param name="langNames">
        /// Object with data 
        /// </param>
        /// <returns>
        /// The <see cref="bool"/> result operation.
        /// </returns>
        public static bool Create(string pathSave, List<LangName> langNames)
        {
            if (langNames == null)
            {
                return false;
            }

            using (var rw = new ResXResourceWriter(pathSave))
            {
                foreach (var item in langNames)
                {
                    var node = CreateNodeElement(item);
                    if (node != null)
                    {
                        rw.AddResource(node);
                    }
                }

                rw.Generate();
                return true;
            }
        }

        /// <summary>
        /// This method need to update Resx
        /// </summary>
        /// <param name="pathSave">
        /// path load/save a Resx file
        /// </param>
        /// <param name="updatedItem">
        /// Object with data
        /// </param>
        /// <returns>
        /// The <see cref="IEnumerable"/> result update data.
        /// </returns>
        public static IEnumerable<LangName> Update(string pathSave, LangName updatedItem)
        {
            var originalElement = Read(pathSave);

            var findIndex = originalElement.FindIndex(e => e.Id == updatedItem.Id);

            if (findIndex >= 0)
            {
                originalElement[findIndex] = updatedItem;
                Create(pathSave, originalElement);
                return originalElement;
            }

            originalElement.Add(updatedItem);
            Create(pathSave, originalElement);
            return originalElement;
        }

        /// <summary>
        /// This method insert node to resource file
        /// </summary>
        /// <param name="pathSave">Path resource file</param>
        /// <param name="newItems">Node to be inserted</param>
        /// <returns>Updated item</returns>
        public static IEnumerable<LangName> Insert(string pathSave, List<LangName> newItems)
        {
            if (newItems == null)
            {
                return null;
            }

            var originalElement = Read(pathSave);

            originalElement.AddRange(newItems);

            Create(pathSave, originalElement);

            return originalElement;
        }

        /// <summary>
        /// This method deletes an element in all resources if the element has been deleted in the main resource.
        /// </summary>
        /// <param name="deleteElement">delete element</param>
        /// <param name="pathSave">path file</param>
        /// <param name="file">file name</param>
        /// <returns>Path all found files</returns>
        public static string[] DeleteAllEntitiesEn(LangName deleteElement, string pathSave, string file = "Resource.resx")
        {
            var allFoundFiles = Directory.GetFiles(pathSave, "Resource.*.resx", SearchOption.AllDirectories);
            
            foreach (var item in allFoundFiles)
            {
                if (file != Path.GetFileName(item))
                {
                    Delete(item, deleteElement);
                }
            }

            return allFoundFiles;
        }

        /// <summary>
        /// This method need for delete node in Resx file
        /// </summary>
        /// <param name="pathSave"> Path save file </param>
        /// <param name="langNameId"> The lang Name ID. </param>
        /// <returns> Update collection </returns>
        public static IEnumerable<LangName> Delete(string pathSave, LangName langNameId)
        {
            var originalElement = Read(pathSave);

            var index = originalElement.FindIndex(e => e.Id == langNameId.Id);

            if (index >= 0)
            {
                originalElement.RemoveAt(index);
                Create(pathSave, originalElement);
            }

            if (pathSave.Contains("Resource.resx"))
            {
                if (DeleteAllEntitiesEn(langNameId, HostingEnvironment.MapPath("~/App_LocalResources/")) == null)
                {
                    return originalElement;
                }
            }

            return originalElement;
        }

        /// <summary>
        /// This method need to parse collection object to JSON format
        /// </summary>
        /// <param name="langNames">lang Names</param>
        /// <returns>Json formatted object</returns>
        public static string ParceToJson(List<LangName> langNames)
        {
            var stringBuilder = new StringBuilder();

            var serializer = new JavaScriptSerializer();

            stringBuilder.Append(string.Join(",", langNames.Select(x => serializer.Serialize(x))));

            return $"[{stringBuilder}]";
        }
    }
}