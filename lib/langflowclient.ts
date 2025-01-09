/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
// export class LangflowClient {
//     baseURL: string;
//     applicationToken: string;
//     constructor(baseURL: string, applicationToken: string) {
//         this.baseURL = baseURL;
//         this.applicationToken = applicationToken;
//     }
//     async post(
//         endpoint: string,
//         body: { input_value: any; input_type: string; output_type: string; tweaks: {}; },
//         headers: { [key: string]: string } = { "Content-Type": "application/json" }
//     ) {
//         headers["Authorization"] = `Bearer ${this.applicationToken}`;
//         headers["Content-Type"] = "application/json";
//         const url = `${this.baseURL}${endpoint}`;
//         try {
//             const response = await fetch(url, {
//                 method: 'POST',
//                 headers: headers,
//                 body: JSON.stringify(body)
//             });

//             const responseMessage = await response.json();
//             if (!response.ok) {
//                 throw new Error(`${response.status} ${response.statusText} - ${JSON.stringify(responseMessage)}`);
//             }
//             return responseMessage;
//         } catch (error) {
//             console.error('Request Error:', (error as Error).message);
//             throw error;
//         }
//     }

//     async initiateSession(flowId: string, langflowId: string, inputValue: any, inputType = 'chat', outputType = 'chat', stream = false) {
//         const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
//         const tweaks = {
//             "ChatInput-AouDw": {
//                 "background_color": "",
//                 "chat_icon": "",
//                 "files": "",
//                 //"input_value": "which type of post got most engagement",
//                 "sender": "User",
//                 "sender_name": "User",
//                 "session_id": "",
//                 "should_store_message": true,
//                 "text_color": ""
//             },
//             "ParseData-aAhxK": {
//                 "sep": "\n",
//                 "template": "{text}"
//             },
//             "Prompt-L9qMi": {
//                 "context": "",
//                 "question": "",
//                 "template": "{context}\n\n---\n\nGiven the context above, answer the question as best as possible. All your answer should be based on the context above. And you are strictly prohibted to say this: \"Unfortunately, I don't have any context to work with\" or anything like this.\n\nQuestion: {question}\n\nAnswer: "
//             },
//             "SplitText-S2ubu": {
//                 "chunk_overlap": 200,
//                 "chunk_size": 1000,
//                 "separator": "\n"
//             },
//             "ChatOutput-8zOW9": {
//                 "background_color": "",
//                 "chat_icon": "",
//                 "data_template": "{text}",
//                 "input_value": "",
//                 "sender": "Machine",
//                 "sender_name": "AI",
//                 "session_id": "",
//                 "should_store_message": true,
//                 "text_color": ""
//             },
//             "AstraDB-BpPE2": {
//                 "advanced_search_filter": "{}",
//                 "api_endpoint": "https://c039e303-6a81-4143-8a54-812e404505b7-us-east-2.apps.astra.datastax.com",
//                 "batch_size": null,
//                 "bulk_delete_concurrency": null,
//                 "bulk_insert_batch_concurrency": null,
//                 "bulk_insert_overwrite_concurrency": null,
//                 "collection_indexing_policy": "",
//                 "collection_name": "social_data",
//                 "embedding_choice": "Embedding Model",
//                 "keyspace": "",
//                 "metadata_indexing_exclude": "",
//                 "metadata_indexing_include": "",
//                 "metric": "cosine",
//                 "number_of_results": 4,
//                 "pre_delete_collection": false,
//                 "search_filter": {},
//                 "search_input": "",
//                 "search_score_threshold": 0,
//                 "search_type": "Similarity",
//                 "setup_mode": "Sync",
//                 "token": "ASTRA_DB_APPLICATION_TOKEN"
//             },
//             "AstraDB-vG6cX": {
//                 "advanced_search_filter": "{}",
//                 "api_endpoint": "https://c039e303-6a81-4143-8a54-812e404505b7-us-east-2.apps.astra.datastax.com",
//                 "batch_size": null,
//                 "bulk_delete_concurrency": null,
//                 "bulk_insert_batch_concurrency": null,
//                 "bulk_insert_overwrite_concurrency": null,
//                 "collection_indexing_policy": "",
//                 "collection_name": "social_data",
//                 "embedding_choice": "Embedding Model",
//                 "keyspace": "",
//                 "metadata_indexing_exclude": "",
//                 "metadata_indexing_include": "",
//                 "metric": "cosine",
//                 "number_of_results": 4,
//                 "pre_delete_collection": false,
//                 "search_filter": {},
//                 "search_input": "",
//                 "search_score_threshold": 0,
//                 "search_type": "Similarity",
//                 "setup_mode": "Sync",
//                 "token": "ASTRA_DB_APPLICATION_TOKEN"
//             },
//             "File-asqxa": {
//                 "concurrency_multithreading": 4,
//                 "path": "social_media_data.csv",
//                 "silent_errors": false,
//                 "use_multithreading": false
//             },
//             "NVIDIAModelComponent-HYZ29": {
//                 "base_url": "https://integrate.api.nvidia.com/v1",
//                 "input_value": "",
//                 "max_tokens": null,
//                 "model_name": "meta/llama-3.1-70b-instruct",
//                 "nvidia_api_key": "Nvidia_Api_key",
//                 "seed": 1,
//                 "stream": false,
//                 "system_message": "",
//                 "temperature": 0.1
//             },
//             "NVIDIAEmbeddingsComponent-wQqCY": {
//                 "base_url": "https://integrate.api.nvidia.com/v1",
//                 "model": "snowflake/arctic-embed-l",
//                 "nvidia_api_key": "Nvidia_Api_key",
//                 "temperature": 0.1
//             },
//             "NVIDIAEmbeddingsComponent-Ba1p9": {
//                 "base_url": "https://integrate.api.nvidia.com/v1",
//                 "model": "baai/bge-m3",
//                 "nvidia_api_key": "Nvidia_Api_key",
//                 "temperature": 0.1
//             }
//         };
//         return this.post(endpoint, { input_value: inputValue, input_type: inputType, output_type: outputType, tweaks: tweaks });
//     }

//     handleStream(streamUrl: string | URL, onUpdate: (arg0: any) => void, onClose: (arg0: string) => void, onError: (arg0: Event) => void) {
//         const eventSource = new EventSource(streamUrl);

//         eventSource.onmessage = event => {
//             const data = JSON.parse(event.data);
//             onUpdate(data);
//         };

//         eventSource.onerror = event => {
//             console.error('Stream Error:', event);
//             onError(event);
//             eventSource.close();
//         };

//         eventSource.addEventListener("close", () => {
//             onClose('Stream closed');
//             eventSource.close();
//         });

//         return eventSource;
//     }

//     async runFlow(flowIdOrName: any, langflowId: any, inputValue: any, inputType = 'chat', outputType = 'chat', stream = false, onUpdate: any, onClose: any, onError: (arg0: string | Event) => void) {
//         try {
//             const initResponse = await this.initiateSession(flowIdOrName, langflowId, inputValue, inputType, outputType, stream);
//             console.log('Init Response:', initResponse);
//             if (stream && initResponse && initResponse.outputs && initResponse.outputs[0].outputs[0].artifacts.stream_url) {
//                 const streamUrl = initResponse.outputs[0].outputs[0].artifacts.stream_url;
//                 console.log(`Streaming from: ${streamUrl}`);
//                 this.handleStream(streamUrl, onUpdate, onClose, onError);
//             }
//             return initResponse;
//         } catch (error) {
//             console.error('Error running flow:', (error as Error).message);
//             onError('Error initiating session');
//         }
//     }
// }

export class LangflowClient {

    baseURL: string;
    applicationToken: string;
    constructor(baseURL: string, applicationToken: string) {
        this.baseURL = baseURL;
        this.applicationToken = applicationToken;
    }

    async post(
        endpoint: string,
        body: { input_value: any; input_type: string; output_type: string; tweaks: {}; },
        headers: { [key: string]: string } = { "Content-Type": "application/json" }
    ) {
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
            console.error('Request Error:', (error as Error).message);
            throw error;
        }
    }

    async initiateSession(flowId: string, langflowId: string, inputValue: any, inputType = 'chat', outputType = 'chat', stream = false) {
        const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
        const tweaks = {
            "ChatInput-smDxN": {},
            "ParseData-s0rFN": {},
            "Prompt-RU1dy": {},
            "SplitText-sBd8u": {},
            "ChatOutput-YMMCP": {},
            "AstraDB-ldz5B": {},
            "File-942u2": {},
            "NVIDIAModelComponent-EoLz4": {},
            "NVIDIAEmbeddingsComponent-q4rAS": {}
        };
        return this.post(endpoint, { input_value: inputValue, input_type: inputType, output_type: outputType, tweaks: tweaks });
    }

    handleStream(streamUrl: string | URL, onUpdate: (arg0: any) => void, onClose: (arg0: string) => void, onError: (arg0: Event) => void) {
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

    async runFlow(flowIdOrName: any, langflowId: any, inputValue: any, inputType = 'chat', outputType = 'chat', stream = false, onUpdate: any, onClose: any, onError: (arg0: string | Event) => void) {
        try {
            const initResponse = await this.initiateSession(flowIdOrName, langflowId, inputValue, inputType, outputType, stream);
            console.log('Init Response:', initResponse);
            if (stream && initResponse && initResponse.outputs && initResponse.outputs[0].outputs[0].artifacts.stream_url) {
                const streamUrl = initResponse.outputs[0].outputs[0].artifacts.stream_url;
                console.log(`Streaming from: ${streamUrl}`);
                this.handleStream(streamUrl, onUpdate, onClose, onError);
            }
            return initResponse;
        } catch (error) {
            console.error('Error running flow:', (error as Error).message);
            onError('Error initiating session');
        }
    }
}