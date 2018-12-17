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
    using Newtonsoft.Json;
    using ResourceEditor.Entities;
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.IO;
    using System.Linq;
    using System.Reflection;
    using System.Resources;
    using System.Text;
    using System.Text.RegularExpressions;
    using System.Web.Hosting;
    using System.Web.Script.Serialization;

    public class Result
    {
        public string Status;
        public string Error;
    }


    /// <summary>
    /// Resource Helper
    /// </summary>
    public class ResourceHelper
    {
        public static List<LangNameLogFull> GetLog()
        {
            //string qwe = @"[{'Id':'q1','Value':'qwe','Comment':'pl'},{'Id':'q1','Value':'qwe','Comment':'pl'}]";

            string path = HostingEnvironment.MapPath($"~/App_LocalResources/Log.txt");

            List<LangNameLogFull> result = null;

            if (File.Exists(path))
            {
                result = new List<LangNameLogFull>();

                using (StreamReader sr = new StreamReader(path))
                {
                    string str = sr.ReadLine().Replace('"', '\'');

                    while (str != null)
                    {
                        result.Add(JsonConvert.DeserializeObject<LangNameLogFull>(str));
                        str = sr.ReadLine();
                    }
                }

                return result;
            }

            return result;
        }
        public static void Logging(LangName langName, string path, string status)
        {
            string fileName = $@"{HostingEnvironment.MapPath("~/App_LocalResources/")}Log.txt";

            if (!File.Exists(fileName))
            {
                var file = System.IO.File.Create(fileName);
                file.Close();
            }

            JsonSerializer serializer = new JsonSerializer();
            using (FileStream fs = new FileStream(fileName, FileMode.Append))
            using (StreamWriter sw = new StreamWriter(fs, Encoding.UTF8))
            {
                using (JsonWriter writer = new JsonTextWriter(sw))
                {
                    LangNameLogFull langNameLog = new LangNameLogFull
                    {
                        LangNameSampleEN = langName,
                        LangNameOld = langName,
                        LangNameNew = langName,
                        StatusLog = status,
                        DateLog = DateTime.Now.ToLocalTime().ToString(),
                        PathLog = Path.GetFileName(path)
                    };

                    serializer.Serialize(writer, langNameLog);

                    sw.WriteLine(System.Environment.NewLine);
                }
            }
        }

        /// <summary>
        /// This method need to parse collection object to JSON format
        /// </summary>
        /// <param name="langNames">lang Names</param>
        /// <returns>Json formatted object</returns>
        public static string ParceToJson(IEnumerable<LangName> langNames)
        {
            var stringBuilder = new StringBuilder();

            var serializer = new JavaScriptSerializer();

            stringBuilder.Append(string.Join(",", langNames.Select(x => serializer.Serialize(x))));

            return $"[{stringBuilder}]";
        }

        /// <summary>
        /// This method checks if the item already exists.
        /// </summary>
        /// <param name="pathLoad">path find</param>
        /// <param name="langName">object lang name</param>
        /// <returns>return result</returns>
        public static LangName DataProtect(string pathLoad, LangName langName)
        {
            if (!File.Exists(pathLoad))
            {
                throw new InvalidOperationException();
            }

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

            if (!System.IO.Directory.Exists(fullPath))
                System.IO.Directory.CreateDirectory(fullPath);

            Directory.CreateDirectory(fullPath);
            var allFoundFiles = Directory.GetFiles(fullPath, file, SearchOption.AllDirectories);

            return allFoundFiles.FirstOrDefault();
        }

        /// <summary>
        /// Get all the data from the file
        /// </summary>
        /// <param name="pathLoad">Full path by explore file</param>
        /// <returns>Edited data</returns>
        private static List<LangName> Read(string pathLoad)
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
                    var tmp = new LangName
                    {
                        Id = node.Name,
                        Value = node.GetValue(assemblies).ToString(),
                        Comment = !string.IsNullOrEmpty(node.Comment) ? node.Comment : string.Empty
                    };
                    outLangNames.Add(tmp);
                }
            }
            return outLangNames;
        }

        public static List<LangName> ReadSortTake(string pathLoad, string sort = "", string filter = "", int takeGet = 5, int pageGet = 1)
        {
            int take = takeGet;
            int page = pageGet;



            var _filter = JsonConvert.DeserializeObject<LangName>(filter);

            var collection = Read(pathLoad);
            var outLangNames = new List<LangName>();

            if (_filter != null)
            {
                foreach (var item in collection)
                {
                    if (item.Id.Contains(_filter.Id) && item.Value.Contains(_filter.Value) && item.Comment.Contains(_filter.Comment))
                    {
                        outLangNames.Add(item);
                    }
                }
            }

            List<LangName> result = null;

            switch (sort)
            {
                case "Id":
                    result = outLangNames.OrderBy(e => e.Id).Skip((page - 1) * take).Take(take).ToList();
                    break;
                case "Value":
                    result = outLangNames.OrderBy(e => e.Value).Skip((page - 1) * take).Take(take).ToList();
                    break;
                case "Comment":
                    result = outLangNames.OrderBy(e => e.Comment).Skip((page - 1) * take).Take(take).ToList();
                    break;
                default:
                    result = outLangNames.ToList();
                    break;
            }

            return result;
        }

        /// <summary>
        /// This method create a Node element of resource file
        /// </summary>
        /// <param name="langName">Object of class LangName</param>
        /// <returns>New node item</returns>
        public static ResXDataNode CreateNodeElement(LangName langName)
        {
            if (!string.IsNullOrWhiteSpace(langName.Id))
            {
                return new ResXDataNode(langName.Id ?? "", langName.Value ?? "")
                {
                    Comment = langName.Comment ?? ""
                };
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
        public static bool Create(string pathSave, IEnumerable<LangName> langNames)
        {
            try
            {
                if (langNames == null)
                {
                    throw new Exception("langNames == null");
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
            catch (System.UnauthorizedAccessException)
            {
                throw;
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
        public static bool Update(string pathSave, LangName updatedItem)
        {
            try
            {
                Logging(updatedItem, pathSave, nameof(updatedItem));

                var originalElement = Read(pathSave);

                var findIndex = originalElement.FindIndex(e => e.Id == updatedItem.Id);

                if (findIndex < 0)
                {
                    return false;
                }

                originalElement[findIndex] = updatedItem;

                Create(pathSave, originalElement);

                return true;
            }
            catch (System.UnauthorizedAccessException)
            {
                throw;
            }
        }

        public static IEnumerable<LangName> InsertInAllFile(string pathSave, LangName newItem)
        {

            var allFoundFiles = Directory.GetFiles(HostingEnvironment.MapPath("~/App_LocalResources/"), "Resource.*.resx", SearchOption.AllDirectories);

            foreach (var item in allFoundFiles)
            {
                if ("Resource.resx" != Path.GetFileName(item))
                {
                    Insert(item, newItem);
                }
            }

            if (newItem == null)
            {
                return null;
            }

            var originalElement = Read(pathSave);

            originalElement.Add(newItem);

            return Create(pathSave, originalElement) ? originalElement : null;
        }

        /// <summary>
        /// This method insert node to resource file
        /// </summary>
        /// <param name="pathSave">Path resource file</param>
        /// <param name="newItem">Node to be inserted</param>
        /// <returns>Updated item</returns>
        public static IEnumerable<LangName> Insert(string pathSave, LangName newItem)
        {
            Logging(newItem, pathSave, nameof(newItem));

            if (newItem == null)
            {
                return null;
            }

            var originalElement = Read(pathSave);

            originalElement.Add(newItem);

            return Create(pathSave, originalElement) ? originalElement : null;
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
    }
}