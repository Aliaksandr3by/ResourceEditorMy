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
        public static List<LogEdit> GetLog()
        {
            //string qwe = @"[{'Id':'q1','Value':'qwe','Comment':'pl'},{'Id':'q1','Value':'qwe','Comment':'pl'}]";

            string path = HostingEnvironment.MapPath($"~/App_LocalResources/Log.txt");

            List<LogEdit> result = null;

            if (File.Exists(path))
            {
                result = new List<LogEdit>();

                using (StreamReader sr = new StreamReader(path))
                {
                    string str = sr.ReadLine().Replace('"', '\'');

                    while (str != null)
                    {
                        result.Add(JsonConvert.DeserializeObject<LogEdit>(str));
                        str = sr.ReadLine();
                    }
                }

                return result;
            }

            return result;
        }
        public static void Logging(LangName langNameNew, LangName langNameOriginal, LangName langNameEN, string path, string status)
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
                    LogEdit langNameLog = new LogEdit
                    {
                        LangNameSampleEN = langNameEN,
                        LangNameOld = langNameOriginal,
                        LangNameNew = langNameNew,
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

        public static int MaxPageResolver(List<LangName> collection, int elementsOnPage)
        {
            int maxElementsOnPage = elementsOnPage;
            int maxCountElement = collection.Count;
            double maxPageOn = (double)maxCountElement / (double)maxElementsOnPage;
            int pageMax = (int)Math.Ceiling(maxPageOn);
            return pageMax;
        }

        public static List<LangName> ReadSortTake(List<LangName> collection, string sort = "", string filter = "", int takeGet = 5, int pageGet = 1)
        {
            List<LangName> outLangNames = new List<LangName>();
            List<LangName> result = null;
            var _filter = JsonConvert.DeserializeObject<LangName>(filter);

            int maxElementsOnPage = takeGet;
            int pageMax = MaxPageResolver(collection, maxElementsOnPage);
            int numberOfPage = pageGet <= pageMax && pageGet > 0 ? pageGet : pageMax;

            if (_filter != null)
            {
                var _filterI = _filter.Id.Split(new Char[] { ' ', ',', '.', ':', '\t' }).ToArray();
                var _filterV = _filter.Value.Split(new Char[] { ' ', ',', '.', ':', '\t' }).ToArray();
                var _filterC = _filter.Comment.Split(new Char[] { ' ', ',', '.', ':', '\t' }).ToArray();

                outLangNames = (from item in collection
                          from itemI in _filterI
                          from itemV in _filterV
                          from itemC in _filterC
                          where item.Id.Contains(itemI) && item.Value.Contains(itemV) && item.Comment.Contains(itemC)
                          select item).Distinct().ToList();
            }
            
            Func<LangName, string> fn = e => e.Id;

            switch (sort)
            {
                case "Id":
                    fn = e => e.Id;
                    break;
                case "Value":
                    fn = e => e.Value;
                    break;
                case "Comment":
                    fn = e => e.Comment;
                    break;
                default:
                    result = outLangNames.ToList();
                    break;
            }

            result = outLangNames.OrderBy(fn).Skip((numberOfPage - 1) * maxElementsOnPage).Take(maxElementsOnPage).ToList();

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
            var originalElement = Read(pathSave);
            var originalElementEn = Read(GetPath());

            var findIndex = originalElement.FindIndex(e => e.Id == updatedItem.Id);
            var findIndexEN = originalElementEn.FindIndex(e => e.Id == updatedItem.Id);

            if (findIndex < 0)
            {
                return false;
            }

            LangName tmpOriginalElement = new LangName
            {
                Id = originalElement[findIndex].Id,
                Value = originalElement[findIndex].Value,
                Comment = originalElement[findIndex].Comment
            };


            originalElement[findIndex] = updatedItem;

            try
            {
                Create(pathSave, originalElement);
            }
            catch (System.UnauthorizedAccessException)
            {
                throw;
            }

            if (findIndexEN < 0)
            {
                Logging(updatedItem, tmpOriginalElement, null, pathSave, nameof(updatedItem));

            }
            else
            {
                Logging(updatedItem, tmpOriginalElement, originalElementEn.ElementAt(findIndexEN), pathSave, nameof(updatedItem));

            }

            return true;
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
            Logging(newItem, null, null, pathSave, nameof(newItem));

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
        public static bool Delete(string pathSave, LangName langNameId)
        {
            try
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
                        return true;
                    }
                }

                return true;
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}