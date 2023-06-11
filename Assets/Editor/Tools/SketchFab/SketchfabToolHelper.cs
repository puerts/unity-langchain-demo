using Sketchfab;
using SimpleJSON;
using UnityEngine;
using UnityEditor;

namespace Puerts.Langchain
{
	[InitializeOnLoad]
    class SketchfabToolHelper
    {
		static SketchfabToolHelper()
		{
            EditorApplication.update += () =>
            {
				SketchfabPlugin.Update();
				_importer.Update();
            };
		}

        private static SketchfabAPI _api = SketchfabPlugin.getAPI();
		private static SketchfabLogger _logger = SketchfabPlugin.getLogger();
		private static SketchfabImporter _importer = new SketchfabImporter(null, null);

        private static string _prefabName;

        public static void FetchArchive(string uid, string prefabName)
        {
            _prefabName = prefabName;
            string url = SketchfabPlugin.Urls.modelEndPoint + "/" + uid + "/download";

            var _modelRequest = new SketchfabRequest(url, _logger.getHeader());
            _modelRequest.setCallback((string response) => {
				JSONNode responseJson = Sketchfab.Utils.JSONParse(response);
				if (responseJson["gltf"] != null)
				{
					var request = new SketchfabRequest(responseJson["gltf"]["url"]);
					request.setCallback((byte[] data) => 
					{
						UnityEngine.Debug.Log(Application.temporaryCachePath);
						string _unzipDirectory = Application.temporaryCachePath + "/unzip";
						var importDirectory = System.IO.Path.Combine(Application.dataPath, "Import", _prefabName);

						if (!GLTFUtils.isFolderInProjectDirectory(importDirectory))
						{
							UnityEngine.Debug.LogError("Please select a path within your Asset directory");
							return;
						}

						_importer.configure(importDirectory, _prefabName, true);
						Debug.Log(data.Length);
						_importer.loadFromBuffer(data);
					});
					_api.registerRequest(request);
				}
				else
				{
					Debug.Log("Unexpected Error: Model archive is not available");
				}
			});
            _api.registerRequest(_modelRequest);
        }
    }
}