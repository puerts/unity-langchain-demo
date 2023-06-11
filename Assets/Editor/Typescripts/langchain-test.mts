import './fetch-polyfill.mjs';
import { OpenAI } from 'langchain/llms';


;
(async function() {
    const model = new OpenAI({
        openAIApiKey: KEY_SG,
    }, {
        basePath: BASE_PATH_SG
    });

    console.log('model requesting');
    const res = await model.call('Which one is better, Unity3D or Unreal Engine?');
    console.log(res.trim());

})().catch(console.error);