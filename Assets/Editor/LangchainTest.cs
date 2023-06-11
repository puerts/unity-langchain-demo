using UnityEditor;
using Puerts;
using Puerts.TSLoader;
using UnityEngine;

namespace PuertsTest
{
    [InitializeOnLoad]
    class LangchainTest
    {
        static LangchainTest()
        {
            EditorApplication.update += () =>
            {
                if (env != null) env.Tick();
            };
        } 

        private static JsEnv env;

        [MenuItem("puer/test")]
        static void Test() 
        {
            // var loader = new TSLoader(System.IO.Path.Combine(Application.dataPath, "../Puer-Project"));
            // loader.UseRuntimeLoader(new NodeModuleLoader(Application.dataPath + "/../Puer-Project"));
            // loader.UseRuntimeLoader(new DefaultLoader());
            // env = new JsEnv(loader);
            // env.ExecuteModule("langchain-test.mts");

            Puerts.Langchain.SketchfabToolHelper.FetchArchive("d2ea5bc76e094f1a9e6aa15891bd6885", "basketballCourt");
            // Puerts.Langchain.SketchfabToolHelper.FetchArchive("aaed331d49fe41bba494cb0cd2ee80a0", "King's_Crown");
        }
    }
}