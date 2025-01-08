/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { LangflowClient } from '@/lib/langflowclient';

interface ServerResponse {
  session_id: string;
  outputs: Array<{
    inputs: {
      input_value: string;
    };
    outputs: Array<{
      results: {
        message: {
          text_key: string;
          data: {
            timestamp: string;
            sender: string;
            sender_name: string;
            session_id: string;
            text: string;
            files: any[];
            error: boolean;
            edit: boolean;
            properties: {
              text_color: string;
              background_color: string;
              edited: boolean;
              source: {
                id: string;
                display_name: string;
                source: string;
              };
              icon: string;
              allow_markdown: boolean;
              state: string;
              targets: any[];
            };
            category: string;
            content_blocks: any[];
            id: string;
            flow_id: string;
          };
        };
      };
    }>;
  }>;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { inputValue } = body;

    if (!inputValue) {
      return NextResponse.json({ error: "Missing inputValue" }, { status: 400 });
    }

    const applicationToken = process.env.DATASTAX_APPLICATION_TOKEN;
    if (!applicationToken) {
      return NextResponse.json({ error: "Missing application token" }, { status: 500 });
    }

    const baseURL = "https://api.langflow.astra.datastax.com";
    const flowId = "d5869d8f-5f81-4282-8ddd-4b4ad40cdd95";
    const langflowId = "f1cd93bf-fb2d-412e-a256-026dc10189a4";
    const stream = false;
    const langflowClient = new LangflowClient(baseURL, applicationToken);

    const response: ServerResponse = await langflowClient.initiateSession(
      flowId,
      langflowId,
      inputValue,
      "chat",
      "chat",
      stream,
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("API Error:", error);
    const errorResponse: Partial<ServerResponse> = {
      session_id: "",
      outputs: [{
        inputs: { input_value: "" },
        outputs: [{
          results: {
            message: {
              text_key: "text",
              data: {
                timestamp: new Date().toISOString(),
                sender: "System",
                sender_name: "Error",
                session_id: "",
                text: "An error occurred while processing your request",
                files: [],
                error: true,
                edit: false,
                properties: {
                  text_color: "red",
                  background_color: "",
                  edited: false,
                  source: { id: "", display_name: "System", source: "error" },
                  icon: "error",
                  allow_markdown: false,
                  state: "error",
                  targets: []
                },
                category: "error",
                content_blocks: [],
                id: "",
                flow_id: ""
              }
            }
          }
        }]
      }]
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}