export const id = 440;
export const ids = [440];
export const modules = {

/***/ 3440:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HfInference": () => (/* binding */ HfInference)
/* harmony export */ });
// src/HfInference.ts
var HfInference = class {
  apiKey;
  defaultOptions;
  constructor(apiKey = "", defaultOptions = {}) {
    this.apiKey = apiKey;
    this.defaultOptions = defaultOptions;
  }
  /**
   * Tries to fill in a hole with a missing word (token to be precise). That’s the base task for BERT models.
   */
  async fillMask(args, options) {
    return this.request(args, options);
  }
  /**
   * This task is well known to summarize longer text into shorter text. Be careful, some models have a maximum length of input. That means that the summary cannot handle full books for instance. Be careful when choosing your model.
   */
  async summarization(args, options) {
    return (await this.request(args, options))?.[0];
  }
  /**
   * Want to have a nice know-it-all bot that can answer any question?. Recommended model: deepset/roberta-base-squad2
   */
  async questionAnswer(args, options) {
    return await this.request(args, options);
  }
  /**
   * Don’t know SQL? Don’t want to dive into a large spreadsheet? Ask questions in plain english! Recommended model: google/tapas-base-finetuned-wtq.
   */
  async tableQuestionAnswer(args, options) {
    return await this.request(args, options);
  }
  /**
   * Usually used for sentiment-analysis this will output the likelihood of classes of an input. Recommended model: distilbert-base-uncased-finetuned-sst-2-english
   */
  async textClassification(args, options) {
    return (await this.request(args, options))?.[0];
  }
  /**
   * Use to continue text from a prompt. This is a very generic task. Recommended model: gpt2 (it’s a simple model, but fun to play with).
   */
  async textGeneration(args, options) {
    return (await this.request(args, options))?.[0];
  }
  /**
   * Usually used for sentence parsing, either grammatical, or Named Entity Recognition (NER) to understand keywords contained within text. Recommended model: dbmdz/bert-large-cased-finetuned-conll03-english
   */
  async tokenClassification(args, options) {
    return HfInference.toArray(await this.request(args, options));
  }
  /**
   * This task is well known to translate text from one language to another. Recommended model: Helsinki-NLP/opus-mt-ru-en.
   */
  async translation(args, options) {
    return (await this.request(args, options))?.[0];
  }
  /**
   * This task is super useful to try out classification with zero code, you simply pass a sentence/paragraph and the possible labels for that sentence, and you get a result. Recommended model: facebook/bart-large-mnli.
   */
  async zeroShotClassification(args, options) {
    return HfInference.toArray(await this.request(args, options));
  }
  /**
   * This task corresponds to any chatbot like structure. Models tend to have shorter max_length, so please check with caution when using a given model if you need long range dependency or not. Recommended model: microsoft/DialoGPT-large.
   *
   */
  async conversational(args, options) {
    return await this.request(args, options);
  }
  /**
   * This task reads some text and outputs raw float values, that are usually consumed as part of a semantic database/semantic search.
   */
  async featureExtraction(args, options) {
    return await this.request(args, options);
  }
  /**
   * This task reads some audio input and outputs the said words within the audio files.
   * Recommended model (english language): facebook/wav2vec2-large-960h-lv60-self
   */
  async automaticSpeechRecognition(args, options) {
    return await this.request(args, {
      ...options,
      binary: true
    });
  }
  /**
   * This task reads some audio input and outputs the likelihood of classes.
   * Recommended model:  superb/hubert-large-superb-er
   */
  async audioClassification(args, options) {
    return await this.request(args, {
      ...options,
      binary: true
    });
  }
  /**
   * This task reads some image input and outputs the likelihood of classes.
   * Recommended model: google/vit-base-patch16-224
   */
  async imageClassification(args, options) {
    return await this.request(args, {
      ...options,
      binary: true
    });
  }
  /**
   * This task reads some image input and outputs the likelihood of classes & bounding boxes of detected objects.
   * Recommended model: facebook/detr-resnet-50
   */
  async objectDetection(args, options) {
    return await this.request(args, {
      ...options,
      binary: true
    });
  }
  /**
   * This task reads some image input and outputs the likelihood of classes & bounding boxes of detected objects.
   * Recommended model: facebook/detr-resnet-50-panoptic
   */
  async imageSegmentation(args, options) {
    return await this.request(args, {
      ...options,
      binary: true
    });
  }
  /**
   * This task reads some text input and outputs an image.
   * Recommended model: stabilityai/stable-diffusion-2
   */
  async textToImage(args, options) {
    return await this.request(args, {
      ...options,
      blob: true
    });
  }
  async request(args, options) {
    const mergedOptions = { ...this.defaultOptions, ...options };
    const { model, ...otherArgs } = args;
    const headers = {};
    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }
    if (!options?.binary) {
      headers["Content-Type"] = "application/json";
    }
    if (options?.binary && mergedOptions.wait_for_model) {
      headers["X-Wait-For-Model"] = "true";
    }
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      headers,
      method: "POST",
      body: options?.binary ? args.data : JSON.stringify({
        ...otherArgs,
        options: mergedOptions
      })
    });
    if (mergedOptions.retry_on_error !== false && response.status === 503 && !mergedOptions.wait_for_model) {
      return this.request(args, {
        ...mergedOptions,
        wait_for_model: true
      });
    }
    if (options?.blob) {
      if (!response.ok) {
        throw new Error("An error occurred while fetching the blob");
      }
      return await response.blob();
    }
    const output = await response.json();
    if (output.error) {
      throw new Error(output.error);
    }
    return output;
  }
  static toArray(obj) {
    if (Array.isArray(obj)) {
      return obj;
    }
    return [obj];
  }
};



/***/ })

};
