export const id = 308;
export const ids = [308];
export const modules = {

/***/ 2308:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "ChatOpenAI": () => (/* binding */ ChatOpenAI)
});

// EXTERNAL MODULE: ./node_modules/openai/dist/index.js
var dist = __webpack_require__(6485);
// EXTERNAL MODULE: ./node_modules/eventsource-parser/dist/index.cjs.mjs
var index_cjs = __webpack_require__(767);
// EXTERNAL MODULE: ./node_modules/langchain/dist/util/axios-fetch-adapter.js
var axios_fetch_adapter = __webpack_require__(7103);
// EXTERNAL MODULE: ./node_modules/gpt3-tokenizer/dist/gpt3-tokenizer.cjs.production.min.js
var gpt3_tokenizer_cjs_production_min = __webpack_require__(5628);
;// CONCATENATED MODULE: ./node_modules/langchain/dist/schema/index.js
class BaseChatMessage {
    constructor(text) {
        /** The text of the message. */
        Object.defineProperty(this, "text", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.text = text;
    }
}
class HumanChatMessage extends BaseChatMessage {
    _getType() {
        return "human";
    }
}
class schema_AIChatMessage extends BaseChatMessage {
    _getType() {
        return "ai";
    }
}
class SystemChatMessage extends BaseChatMessage {
    _getType() {
        return "system";
    }
}
class ChatMessage extends BaseChatMessage {
    constructor(text, role) {
        super(text);
        Object.defineProperty(this, "role", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.role = role;
    }
    _getType() {
        return "generic";
    }
}
/**
 * Base PromptValue class. All prompt values should extend this class.
 */
class BasePromptValue {
}
/**
 * Class to parse the output of an LLM call.
 */
class BaseOutputParser {
    async parseWithPrompt(text, _prompt) {
        return this.parse(text);
    }
    /**
     * Return the string type key uniquely identifying this class of parser
     */
    _type() {
        throw new Error("_type not implemented");
    }
}
class OutputParserException extends Error {
    constructor(message) {
        super(message);
    }
}
//# sourceMappingURL=index.js.map
// EXTERNAL MODULE: ./node_modules/langchain/dist/base_language/index.js + 8 modules
var base_language = __webpack_require__(7591);
;// CONCATENATED MODULE: ./node_modules/langchain/dist/memory/base.js

class BaseMemory {
}
const getInputValue = (inputValues, inputKey) => {
    if (inputKey !== undefined) {
        return inputValues[inputKey];
    }
    const keys = Object.keys(inputValues);
    if (keys.length === 1) {
        return inputValues[keys[0]];
    }
    throw new Error(`input values have multiple keys, memory only supported when one key currently: ${keys}`);
};
function getBufferString(messages, human_prefix = "Human", ai_prefix = "AI") {
    const string_messages = [];
    for (const m of messages) {
        let role;
        if (m instanceof HumanChatMessage) {
            role = human_prefix;
        }
        else if (m instanceof schema_AIChatMessage) {
            role = ai_prefix;
        }
        else if (m instanceof SystemChatMessage) {
            role = "System";
        }
        else if (m instanceof ChatMessage) {
            role = m.role;
        }
        else {
            throw new Error(`Got unsupported message type: ${m}`);
        }
        string_messages.push(`${role}: ${m.text}`);
    }
    return string_messages.join("\n");
}
//# sourceMappingURL=base.js.map
;// CONCATENATED MODULE: ./node_modules/langchain/dist/chat_models/base.js




class BaseChatModel extends base_language/* BaseLanguageModel */.q {
    constructor({ ...rest }) {
        super(rest);
        Object.defineProperty(this, "_tokenizer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    async generate(messages, stop) {
        const generations = [];
        const llmOutputs = [];
        const messageStrings = messages.map((messageList) => getBufferString(messageList));
        await this.callbackManager.handleLLMStart({ name: this._llmType() }, messageStrings, this.verbose);
        try {
            for (const message of messages) {
                const result = await this._generate(message, stop);
                if (result.llmOutput) {
                    llmOutputs.push(result.llmOutput);
                }
                generations.push(result.generations);
            }
        }
        catch (err) {
            await this.callbackManager.handleLLMError(err, this.verbose);
            throw err;
        }
        const output = {
            generations,
            llmOutput: llmOutputs.length
                ? this._combineLLMOutput?.(...llmOutputs)
                : undefined,
        };
        await this.callbackManager.handleLLMEnd(output, this.verbose);
        return output;
    }
    _modelType() {
        return "base_chat_model";
    }
    getNumTokens(text) {
        // TODOs copied from py implementation
        // TODO: this method may not be exact.
        // TODO: this method may differ based on model (eg codex, gpt-3.5).
        if (this._tokenizer === undefined) {
            const Constructor = gpt3_tokenizer_cjs_production_min/* default */.Z;
            this._tokenizer = new Constructor({ type: "gpt3" });
        }
        return this._tokenizer.encode(text).bpe.length;
    }
    async generatePrompt(promptValues, stop) {
        const promptMessages = promptValues.map((promptValue) => promptValue.toChatMessages());
        return this.generate(promptMessages, stop);
    }
    async call(messages, stop) {
        const result = await this.generate([messages], stop);
        const generations = result.generations;
        return generations[0][0].message;
    }
    async callPrompt(promptValue, stop) {
        const promptMessages = promptValue.toChatMessages();
        return this.call(promptMessages, stop);
    }
}
class SimpleChatModel extends (/* unused pure expression or super */ null && (BaseChatModel)) {
    async _generate(messages, stop) {
        const text = await this._call(messages, stop);
        const message = new AIChatMessage(text);
        return {
            generations: [
                {
                    text: message.text,
                    message,
                },
            ],
        };
    }
}
//# sourceMappingURL=base.js.map
;// CONCATENATED MODULE: ./node_modules/langchain/dist/chat_models/openai.js





function messageTypeToOpenAIRole(type) {
    switch (type) {
        case "system":
            return "system";
        case "ai":
            return "assistant";
        case "human":
            return "user";
        default:
            throw new Error(`Unknown message type: ${type}`);
    }
}
function openAIResponseToChatMessage(role, text) {
    switch (role) {
        case "user":
            return new HumanChatMessage(text);
        case "assistant":
            return new schema_AIChatMessage(text);
        case "system":
            return new SystemChatMessage(text);
        default:
            return new ChatMessage(text, role ?? "unknown");
    }
}
/**
 * Wrapper around OpenAI large language models that use the Chat endpoint.
 *
 * To use you should have the `openai` package installed, with the
 * `OPENAI_API_KEY` environment variable set.
 *
 * @remarks
 * Any parameters that are valid to be passed to {@link
 * https://platform.openai.com/docs/api-reference/chat/create |
 * `openai.createCompletion`} can be passed through {@link modelKwargs}, even
 * if not explicitly available on this class.
 *
 * @augments BaseLLM
 * @augments OpenAIInput
 */
class ChatOpenAI extends BaseChatModel {
    constructor(fields, configuration) {
        super(fields ?? {});
        Object.defineProperty(this, "temperature", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "topP", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "frequencyPenalty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "presencePenalty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "n", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "logitBias", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "modelName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "gpt-3.5-turbo"
        });
        Object.defineProperty(this, "modelKwargs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "stop", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "streaming", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "maxTokens", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // Used for non-streaming requests
        Object.defineProperty(this, "batchClient", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // Used for streaming requests
        Object.defineProperty(this, "streamingClient", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "clientConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const apiKey = fields?.openAIApiKey ?? process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error("OpenAI API key not found");
        }
        this.modelName = fields?.modelName ?? this.modelName;
        this.modelKwargs = fields?.modelKwargs ?? {};
        this.temperature = fields?.temperature ?? this.temperature;
        this.topP = fields?.topP ?? this.topP;
        this.frequencyPenalty = fields?.frequencyPenalty ?? this.frequencyPenalty;
        this.presencePenalty = fields?.presencePenalty ?? this.presencePenalty;
        this.maxTokens = fields?.maxTokens;
        this.n = fields?.n ?? this.n;
        this.logitBias = fields?.logitBias;
        this.stop = fields?.stop;
        this.streaming = fields?.streaming ?? false;
        if (this.streaming && this.n > 1) {
            throw new Error("Cannot stream results when n > 1");
        }
        this.clientConfig = {
            apiKey: fields?.openAIApiKey ?? process.env.OPENAI_API_KEY,
            ...configuration,
        };
    }
    /**
     * Get the parameters used to invoke the model
     */
    invocationParams() {
        return {
            model: this.modelName,
            temperature: this.temperature,
            top_p: this.topP,
            frequency_penalty: this.frequencyPenalty,
            presence_penalty: this.presencePenalty,
            max_tokens: this.maxTokens,
            n: this.n,
            logit_bias: this.logitBias,
            stop: this.stop,
            stream: this.streaming,
            ...this.modelKwargs,
        };
    }
    _identifyingParams() {
        return {
            model_name: this.modelName,
            ...this.invocationParams(),
            ...this.clientConfig,
        };
    }
    /**
     * Get the identifying parameters for the model
     */
    identifyingParams() {
        return this._identifyingParams();
    }
    /**
     * Call out to OpenAI's endpoint with k unique prompts
     *
     * @param messages - The messages to pass into the model.
     * @param [stop] - Optional list of stop words to use when generating.
     *
     * @returns The full LLM output.
     *
     * @example
     * ```ts
     * import { OpenAI } from "langchain/llms";
     * const openai = new OpenAI();
     * const response = await openai.generate(["Tell me a joke."]);
     * ```
     */
    async _generate(messages, stop) {
        const tokenUsage = {};
        if (this.stop && stop) {
            throw new Error("Stop found in input and default params");
        }
        const params = this.invocationParams();
        params.stop = stop ?? params.stop;
        const { data } = await this.completionWithRetry({
            ...params,
            messages: messages.map((message) => ({
                role: messageTypeToOpenAIRole(message._getType()),
                content: message.text,
            })),
        });
        if (params.stream) {
            let role = "assistant";
            const completion = await new Promise((resolve, reject) => {
                let innerCompletion = "";
                const parser = (0,index_cjs/* createParser */.j)((event) => {
                    if (event.type === "event") {
                        if (event.data === "[DONE]") {
                            resolve(innerCompletion);
                        }
                        else {
                            const response = JSON.parse(event.data);
                            const part = response.choices[0];
                            if (part != null) {
                                innerCompletion += part.delta?.content ?? "";
                                role = part.delta?.role ?? role;
                                // eslint-disable-next-line no-void
                                void this.callbackManager.handleLLMNewToken(part.delta?.content ?? "", true);
                            }
                        }
                    }
                });
                // workaround for incorrect axios types
                const stream = data;
                stream.on("data", (data) => parser.feed(data.toString("utf-8")));
                stream.on("error", (error) => reject(error));
            });
            return {
                generations: [
                    {
                        text: completion,
                        message: openAIResponseToChatMessage(role, completion),
                    },
                ],
            };
        }
        const { completion_tokens: completionTokens, prompt_tokens: promptTokens, total_tokens: totalTokens, } = data.usage ?? {};
        if (completionTokens) {
            tokenUsage.completionTokens =
                (tokenUsage.completionTokens ?? 0) + completionTokens;
        }
        if (promptTokens) {
            tokenUsage.promptTokens = (tokenUsage.promptTokens ?? 0) + promptTokens;
        }
        if (totalTokens) {
            tokenUsage.totalTokens = (tokenUsage.totalTokens ?? 0) + totalTokens;
        }
        const generations = [];
        for (const part of data.choices) {
            const role = part.message?.role ?? undefined;
            const text = part.message?.content ?? "";
            generations.push({
                text,
                message: openAIResponseToChatMessage(role, text),
            });
        }
        return {
            generations,
            llmOutput: { tokenUsage },
        };
    }
    /** @ignore */
    async completionWithRetry(request) {
        if (!request.stream && !this.batchClient) {
            const clientConfig = new dist.Configuration({
                ...this.clientConfig,
                baseOptions: { adapter: axios_fetch_adapter/* default */.Z },
            });
            this.batchClient = new dist.OpenAIApi(clientConfig);
        }
        if (request.stream && !this.streamingClient) {
            const clientConfig = new dist.Configuration(this.clientConfig);
            this.streamingClient = new dist.OpenAIApi(clientConfig);
        }
        const client = !request.stream ? this.batchClient : this.streamingClient;
        return this.caller.call(client.createChatCompletion.bind(client), request, request.stream ? { responseType: "stream" } : undefined);
    }
    _llmType() {
        return "openai";
    }
    _combineLLMOutput(...llmOutputs) {
        return llmOutputs.reduce((acc, llmOutput) => {
            if (llmOutput && llmOutput.tokenUsage) {
                acc.tokenUsage.completionTokens +=
                    llmOutput.tokenUsage.completionTokens ?? 0;
                acc.tokenUsage.promptTokens += llmOutput.tokenUsage.promptTokens ?? 0;
                acc.tokenUsage.totalTokens += llmOutput.tokenUsage.totalTokens ?? 0;
            }
            return acc;
        }, {
            tokenUsage: {
                completionTokens: 0,
                promptTokens: 0,
                totalTokens: 0,
            },
        });
    }
}
//# sourceMappingURL=openai.js.map

/***/ })

};
