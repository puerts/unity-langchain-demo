import 'fetch-polyfill';
import { OpenAI } from 'langchain/llms';

(async function() {
    const model = new OpenAI({
        openAIApiKey: ''
    });

    const res = await model.call('Which one is better, Unity3D or Unreal Engine?');
    console.log(res);

})().catch(console.error);