# Use Langchain.js in Unity3D

This demo is based on [PuerTS](https://github.com/Tencent/puerts.git) so we can use Node.js in Unity3D.

use `langchain.js` for fun.

![UnityOrUnreal](https://user-images.githubusercontent.com/5595819/227445983-e4f29b60-f6bf-433c-9537-c77c6d34c0ad.png)

> I asked him `Which one is better, Unity3D or Unreal Engine?`

### Example
Sample code is in `Assets/Scenes/Langchain.cs`, and it Execute `Assets/Typescripts/langchain-test.mts`.

Make sure you fill the OpenAI API key in `Assets/Typescripts/langchain-test.mts` first.

### Do more in example

* modify the code in `Assets`. And `Assets/Typescripts` is where your TS code is located.

* if you want to add more node_modules. 
    1. run `npm install` in `Puer-Project` first.
    2. add a js in `Puer-Project/src-for-puer`. It import some modules in node_modules and export it.
    3. add a config in `Puer-Project/webpack.config.js` just like `langchain/llvm`
    4. run `npx webpack -c webpack.config.js`
    5. import it in `Assets/Typescripts`
