using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Xml.Serialization;
using System.ComponentModel.Design;
using System.Resources;
using System.Collections;
using System.Reflection;
using System.IO;

namespace ResourceEditor.Models
{
    public class ResourceHelper
    {
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
                            Value = node.GetValue(assemblies).ToString(),
                            Comment = !String.IsNullOrEmpty(node.Comment) ? node.Comment : ""
                        });
                }
            }
            return outLangNames;
        }

        public static void CreateResourceFile(
            List<LangName> langName, 
            string pathSave, 
            List<LangName> langNameAdd = null)
        {
            File.Copy(pathSave, pathSave+".back", true);
            using (ResXResourceWriter rw = new ResXResourceWriter(pathSave))
            {
                for (int ctr = 0; ctr < langName.Count; ctr++)
                {
                    ResXDataNode node = new ResXDataNode(langName[ctr].Id, langName[ctr].Value);
                    node.Comment = langName[ctr].Comment;
                    rw.AddResource(node);
                }

                if (langNameAdd != null)
                {
                    //если ключ существует и иесли запись не добавилась warn
                    foreach (var item in langNameAdd)
                    {
                        if (item.Id != null && item.Value != null)
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
        public static void AddResourceFile(LangName langName, string pathSave)
        {


        }
    }

    [Serializable]
    public class LangName
    {
        [XmlAttribute]
        public string Id { get; set; }
        [XmlAttribute]
        public string Value { get; set; }
        [XmlAttribute]
        public string Comment { get; set; }
    }
}