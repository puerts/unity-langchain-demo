using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.IO;
using Puerts;
using Puerts.TSLoader;

public class Langchain : MonoBehaviour
{
    JsEnv env;
    // Start is called before the first frame update
    void Start()
    {
        env = new JsEnv(new TSLoader(Path.Combine(Application.dataPath, "../Puer-Project/dist-for-puer")));
        env.ExecuteModule("langchain-test.mts");
    }

    // Update is called once per frame
    void Update()
    {
        env.Tick();
    }
}
