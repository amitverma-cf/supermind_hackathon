import { NextApiRequest, NextApiResponse } from 'next';

// Note: Replace **<YOUR_APPLICATION_TOKEN>** with your actual Application token

class LangflowClient {
  baseURL: string;
  applicationToken: string;
  constructor(baseURL: string, applicationToken: string) {
    this.baseURL = baseURL;
    this.applicationToken = applicationToken;
  }
  async post(endpoint: string, body: { input_value: any; input_type: string; output_type: string; tweaks: {}; }, headers: { [key: string]: string } = { "Content-Type": "application/json" }) {
    headers["Authorization"] = `Bearer ${this.applicationToken}`;
    headers["Content-Type"] = "application/json";
    const url = `${this.baseURL}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      });

      const responseMessage = await response.json();
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText} - ${JSON.stringify(responseMessage)}`);
      }
      return responseMessage;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Request Error:', errorMessage);
      throw error;
    }
  }

  async initiateSession(flowId: string, langflowId: string, inputValue: any, inputType = 'chat', outputType = 'chat', stream = false, tweaks = {}) {
    const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
    return this.post(endpoint, { input_value: inputValue, input_type: inputType, output_type: outputType, tweaks: tweaks });
  }

  handleStream(streamUrl: string | URL, onUpdate: (arg0: any) => void, onClose: (arg0: string) => void, onError: (arg0: Event | string) => void) {
    const eventSource = new EventSource(streamUrl);

    eventSource.onmessage = event => {
      const data = JSON.parse(event.data);
      onUpdate(data);
    };

    eventSource.onerror = event => {
      console.error('Stream Error:', event);
      onError(event);
      eventSource.close();
    };

    eventSource.addEventListener("close", () => {
      onClose('Stream closed');
      eventSource.close();
    });

    return eventSource;
  }

  async runFlow(flowIdOrName: string, langflowId: string, inputValue: any, inputType = 'chat', outputType = 'chat', tweaks = {}, stream = false, onUpdate: (data: any) => void, onClose: (message: any) => void, onError: { (error: any): void; (arg0: string): void; }) {
    try {
      const initResponse = await this.initiateSession(flowIdOrName, langflowId, inputValue, inputType, outputType, stream, tweaks);
      console.log('Init Response:', initResponse);
      if (stream && initResponse && initResponse.outputs && initResponse.outputs[0].outputs[0].artifacts.stream_url) {
        const streamUrl = initResponse.outputs[0].outputs[0].artifacts.stream_url;
        console.log(`Streaming from: ${streamUrl}`);
        this.handleStream(streamUrl, onUpdate, onClose, onError);
      }
      return initResponse;
    } catch (error) {
      console.error('Error running flow:', error);
      onError('Error initiating session');
    }
  }
}

async function main(inputValue: string, inputType = 'chat', outputType = 'chat', stream = false) {
  const flowIdOrName = 'd5869d8f-5f81-4282-8ddd-4b4ad40cdd95';
  const langflowId = 'f1cd93bf-fb2d-412e-a256-026dc10189a4';
  const applicationToken = process.env.DATASTAX_APPLICATION_TOKEN || "";
  const langflowClient = new LangflowClient('https://api.langflow.astra.datastax.com',
    applicationToken);

  try {
    const tweaks = {
      "ChatInput-AouDw": {},
      "ParseData-aAhxK": {},
      "Prompt-L9qMi": {},
      "SplitText-S2ubu": {},
      "ChatOutput-8zOW9": {},
      "AstraDB-BpPE2": {},
      "AstraDB-vG6cX": {},
      "File-asqxa": {},
      "NVIDIAModelComponent-HYZ29": {},
      "NVIDIAEmbeddingsComponent-wQqCY": {},
      "NVIDIAEmbeddingsComponent-Ba1p9": {}
    };
    const response = await langflowClient.runFlow(
      flowIdOrName,
      langflowId,
      inputValue,
      inputType,
      outputType,
      tweaks,
      stream,
      (data: { chunk: any; }) => console.log("Received:", data.chunk), // onUpdate
      (message: any) => console.log("Stream Closed:", message), // onClose
      (error: any) => console.log("Stream Error:", error) // onError
    );
    if (!stream && response && response.outputs) {
      const flowOutputs = response.outputs[0];
      const firstComponentOutputs = flowOutputs.outputs[0];
      const output = firstComponentOutputs.outputs.message;

      console.log("Final Output:", output.message.text);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Main Error', errorMessage);
  }
}

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Please run the file with the message as an argument: node <YOUR_FILE_NAME>.js "user_message"');
}
main(
  args[0], // inputValue
  args[1], // inputType
  args[2], // outputType
  args[3] === 'true' // stream
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { inputValue } = req.body;

    if (!inputValue) {
      return res.status(400).json({ error: "Missing inputValue" });
    }

    const applicationToken = process.env.DATASTAX_APPLICATION_TOKEN;
    if (!applicationToken) {
      return res.status(500).json({ error: "Missing application token in environment variables." });
    }

    const baseURL = "https://api.langflow.astra.datastax.com";
    const flowId = "d5869d8f-5f81-4282-8ddd-4b4ad40cdd95";
    const langflowId = "f1cd93bf-fb2d-412e-a256-026dc10189a4";

    const langflowClient = new LangflowClient(baseURL, applicationToken);

    const response = await langflowClient.initiateSession(
      flowId,
      langflowId,
      inputValue,
      "chat",
      "chat",
    );

    const message =
      response.outputs?.[0]?.outputs?.[0]?.outputs?.message?.text || "No response from AI";

    return res.status(200).json({ message });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}