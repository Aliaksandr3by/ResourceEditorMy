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

namespace ResourceEditor.Models
{
    public class ResourceHelper
    {
        public static List<LangName> ReadResourceFile(List<LangName> langNames, string pathLoad)
        {
            ResXResourceReader rr = new ResXResourceReader(pathLoad);
            rr.UseResXDataNodes = true; //делает элемент ресурса комментарий доступным
            IDictionaryEnumerator dict = rr.GetEnumerator();
            while (dict.MoveNext())
            {
                ResXDataNode node = (ResXDataNode)dict.Value;
                AssemblyName[] assemblies = Assembly.GetExecutingAssembly().GetReferencedAssemblies();
                langNames.Add(
                    new LangName{
                    Id = node.Name,
                    Value = node.GetValue(assemblies).ToString(),
                    Comment = !String.IsNullOrEmpty(node.Comment) ? node.Comment : ""
                });
            }
            return langNames;
        }

        public static void CreateResourceFile(List<LangName> langName, string pathSave)
        {
            ResXResourceWriter rw = new ResXResourceWriter(pathSave);
            rw.AddResource("Title", "Country Information");
            rw.AddResource("nColumns", langName.Count);
            for (int ctr = 0; ctr < langName.Count; ctr++)
            {
                ResXDataNode node = new ResXDataNode(langName[ctr].Id, langName[ctr].Value);
                node.Comment = langName[ctr].Comment;
                rw.AddResource(node);
            }
            rw.Generate();
            rw.Close();
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