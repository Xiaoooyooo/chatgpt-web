export type CompletionMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  name?: string;
};

type OnProgressFn = (data: any) => void;
type CompletionOptions = {
  authKey: string;
  model: string;
  messages: CompletionMessage[];
  temperature?: number;
  top_p?: number;
  n?: number;
  stream?: true;
  onProgress: OnProgressFn;
}

export default function completion(options: CompletionOptions) {
  return fetch("https://api.openai.com/v1/chat/completions", {
    method: "post",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${options.authKey}`,
    },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      temperature: options.temperature,
      top_p: options.top_p,
      n: options.n,
      stream: true,
    }),
  }).then(response => {
    if (response.ok) {
      return parseStreamBody(response.body!, options.onProgress);
    }
    return Promise.reject(response.status);
  })
}

async function parseStreamBody(stream: ReadableStream<Uint8Array>, onProgress: OnProgressFn) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  const parser = new EventStreamTextParser();
  let temp = await reader.read();
  while (!temp.done) {
    const text = decoder.decode(temp.value);
    parser.parse(text, onProgress);
    temp = await reader.read();
  }
  reader.releaseLock();
}

class EventStreamTextParser {
  p = 0;
  result = "";
  escape = false;
  inString = false;
  parse(text: string, onProgress: OnProgressFn) {
    for (let i = 0, len = text.length; i < len; i++) {
      const c = text[i];
      if (c === "\"" && !this.escape) {
        this.inString = !this.inString;
      }
      if (c === "{" && !this.escape && !this.inString) {
        this.p += 1;
      }
      if (this.p !== 0) {
        this.result += c;
      }
      if (this.p !== 0 && c === "}" && !this.escape && !this.inString) {
        this.p -= 1;
      }
      if (c === "\\" && !this.escape) {
        this.escape = true;
      } else {
        this.escape = false;
      }
      if (this.p === 0 && this.result !== "") {
        try {
          const parsed = JSON.parse(this.result);
          onProgress(parsed);
        } catch (err) {
          console.error(err);
        }
        this.result = "";
      }
    }
  }
}
