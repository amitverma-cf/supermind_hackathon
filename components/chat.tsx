/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Markdown from "react-markdown";

interface Source {
    id: string;
    display_name: string;
    source: string;
}

interface Properties {
    text_color: string;
    background_color: string;
    edited: boolean;
    source: Source;
    icon: string;
    allow_markdown: boolean;
    state: string;
    targets: any[];
}

interface Message {
    timestamp: string;
    sender: string;
    sender_name: string;
    session_id: string;
    text: string;
    files: any[];
    error: boolean;
    edit: boolean;
    properties: Properties;
    category: string;
    content_blocks: any[];
    id?: string;
    flow_id?: string;
}

const ChatApp = () => {
    const [userMessage, setUserMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<Message[]>([
        {
            timestamp: new Date().toISOString(),
            sender: "AI",
            sender_name: "AI",
            session_id: "",
            text: "Hello! How can I help you today?",
            files: [],
            error: false,
            edit: false,
            properties: {
                text_color: "",
                background_color: "",
                edited: false,
                source: { id: "", display_name: "", source: "" },
                icon: "",
                allow_markdown: false,
                state: "complete",
                targets: []
            },
            category: "message",
            content_blocks: []
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string>("");
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = async () => {
        if (!userMessage.trim()) return;

        const newMessage: Message = {
            timestamp: new Date().toISOString(),
            sender: "User",
            sender_name: "User",
            session_id: sessionId,
            text: userMessage,
            files: [],
            error: false,
            edit: false,
            properties: {
                text_color: "",
                background_color: "",
                edited: false,
                source: { id: "", display_name: "", source: "" },
                icon: "",
                allow_markdown: false,
                state: "complete",
                targets: []
            },
            category: "message",
            content_blocks: []
        };

        setChatHistory((prev) => [...prev, newMessage]);
        setUserMessage("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ inputValue: userMessage }),
            });

            if (!response.ok) {
                throw new Error("API Error");
            }

            const data = await response.json();
            if (!sessionId) setSessionId(data.session_id);

            const aiMessage = data.outputs[0].outputs[0].results.message.data;
            setChatHistory((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error:", error);
            const errorMessage: Message = {
                timestamp: new Date().toISOString(),
                sender: "AI",
                sender_name: "AI",
                session_id: sessionId,
                text: "An error occurred. Please try again.",
                files: [],
                error: true,
                edit: false,
                properties: {
                    text_color: "red",
                    background_color: "",
                    edited: false,
                    source: { id: "", display_name: "", source: "" },
                    icon: "error",
                    allow_markdown: false,
                    state: "error",
                    targets: []
                },
                category: "error",
                content_blocks: []
            };
            setChatHistory((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    return (
        <div className="h-full w-full md:w-11/12 mx-auto lg:w-1/3 lg:fixed lg:bottom-0">
            <div className="w-full bg-gray-50">
                <div
                    ref={chatContainerRef}
                    className="lg:h-[calc(100vh-100px)] h-[calc(100vh-184px)] overflow-y-scroll mb-4 space-y-4 p-4"
                >
                    {chatHistory.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.sender === "User" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-3/4 ${message.sender === "User"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-black"
                                    } rounded-lg p-2`}
                                style={{
                                    backgroundColor: message.properties.background_color || undefined,
                                    color: message.properties.text_color || undefined,
                                }}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    {message.properties.icon && (
                                        <span className="text-sm">{message.properties.icon}</span>
                                    )}
                                    <span className="font-semibold">{message.sender_name}</span>
                                    <span className="text-xs opacity-70">
                                        {new Date(message.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                                <Markdown>{message.text}</Markdown>
                                {message.properties.source.display_name && (
                                    <div className="text-xs mt-2 opacity-70">
                                        Source: {message.properties.source.display_name}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 p-4">
                    <Input
                        type="text"
                        placeholder="Type your message..."
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={isLoading}>
                        {isLoading ? "Sending..." : "Send"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatApp;