"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type Message = {
    sender: string;
    text: string;
};

const ChatApp = () => {
    const [userMessage, setUserMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!userMessage.trim()) return;

        const newMessage = { sender: "User", text: userMessage };
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
                const errorText = await response.text();
                console.error("Error Response:", errorText);
                throw new Error("API Error");
            }

            const data = await response.json();
            const aiMessage = { sender: "AI", text: data.message };
            setChatHistory((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error:", error);
            setChatHistory((prev) => [
                ...prev,
                { sender: "AI", text: "An error occurred. Please try again." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
                <div className="h-96 overflow-y-scroll mb-4">
                    {chatHistory.map((message, index) => (
                        <div
                            key={index}
                            className={`mb-2 ${message.sender === "User" ? "text-right" : "text-left"}`}
                        >
                            <span
                                className={`inline-block px-4 py-2 rounded-lg ${message.sender === "User"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-black"}`}
                            >
                                {message.text}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Type your message..."
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
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