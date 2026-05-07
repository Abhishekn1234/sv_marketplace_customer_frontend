"use client";

import { useState } from "react";
import OpenAI from "openai";
import { useNavigate } from "react-router-dom";

import Button from "@/components/input/Button";
import { Input } from "@/components/input";

import {
  ArrowLeftIcon,
  SendIcon,
} from "@/components/icons";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,

  baseURL: "https://api.groq.com/openai/v1",

  dangerouslyAllowBrowser: true,
});

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function AIChatPage() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hello 👋 How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setInput("");

    setLoading(true);

    try {
      // 🔥 FULL CHAT HISTORY
      const formattedMessages = [
        {
          role: "system",
          content: `
You are an intelligent AI assistant for an On-Demand Home Service Marketplace App.

Platform Features:
- Users can book workers
- Services include:
  - Plumbing
  - Electrician
  - AC Repair
  - Cleaning
  - Painting
  - Carpentry
  - Driving
  - Home Services

App Features:
- Booking services
- Real-time tracking
- Worker chat
- Video calls
- Notifications
- Online payments
- Invoice system
- Disputes
- Ratings & reviews

Routes:
- /bookings
- /
- /profile
- /help
- /payment
- /notifications
- /chat
- /jobtracking/:bookingId
- /message/:workerId

Rules:
- Answer naturally
- Be friendly
- Help users understand the app
- Recommend services
- Answer dynamically
- Keep answers short

IMPORTANT ACTION RULES:

If user wants bookings:
Return:
[ACTION:BOOKINGS]

If user wants profile:
Return:
[ACTION:PROFILE]

If user needs help:
Return:
[ACTION:HELP]

If user wants notifications:
Return:
[ACTION:NOTIFICATIONS]

If user wants payment:
Return:
[ACTION:PAYMENT]

If user wants AI chat:
Return:
[ACTION:CHAT]
`,
        },

        // 🔥 SEND OLD CHAT HISTORY
        ...messages.map((msg) => ({
          role:
            msg.role === "ai"
              ? "assistant"
              : "user",

          content: msg.text,
        })),

        // 🔥 CURRENT MESSAGE
        {
          role: "user",
          content: userMessage,
        },
      ];

      const response =
        await client.chat.completions.create({
          model:
            "llama-3.3-70b-versatile",

          messages:
            formattedMessages as any,

          temperature: 0.7,

          max_tokens: 500,
        });

      let aiText =
        response.choices[0]?.message
          ?.content || "No response";

      // 🔥 HANDLE NAVIGATION ACTIONS

      if (
        aiText.includes(
          "[ACTION:BOOKINGS]"
        )
      ) {
        navigate("/bookings");

        aiText = aiText.replace(
          "[ACTION:BOOKINGS]",
          ""
        );
      }

      if (
        aiText.includes(
          "[ACTION:PROFILE]"
        )
      ) {
        navigate("/profile");

        aiText = aiText.replace(
          "[ACTION:PROFILE]",
          ""
        );
      }

      if (
        aiText.includes("[ACTION:HELP]")
      ) {
        navigate("/help");

        aiText = aiText.replace(
          "[ACTION:HELP]",
          ""
        );
      }

      if (
        aiText.includes(
          "[ACTION:PAYMENT]"
        )
      ) {
        navigate("/payment");

        aiText = aiText.replace(
          "[ACTION:PAYMENT]",
          ""
        );
      }

      if (
        aiText.includes(
          "[ACTION:NOTIFICATIONS]"
        )
      ) {
        navigate("/notifications");

        aiText = aiText.replace(
          "[ACTION:NOTIFICATIONS]",
          ""
        );
      }

      if (
        aiText.includes("[ACTION:CHAT]")
      ) {
        navigate("/chat");

        aiText = aiText.replace(
          "[ACTION:CHAT]",
          ""
        );
      }

      // 🔥 ADD AI RESPONSE
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: aiText.trim(),
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            "AI service unavailable ❌",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-3 border-b bg-white px-4 py-4 shadow-sm">
        <Button
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon size={22} />
        </Button>

        <div>
          <h1 className="text-lg font-bold">
            AI Assistant
          </h1>

          <p className="text-xs text-gray-500">
            Smart Marketplace Support
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-black text-white"
                  : "bg-white text-gray-800 shadow"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-white px-4 py-3 text-sm shadow">
              Typing...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t bg-white p-3">
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2">
          {/* Input */}
          <div className="flex-1">
            <Input
              type="text"
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                handleSend()
              }
              placeholder="Ask anything..."
              className="
                w-full
                border-none
                bg-transparent
                px-0
                py-0
                text-sm
                outline-none
                ring-0
                focus:ring-0
                focus:outline-none
                shadow-none
              "
            />
          </div>

          {/* Send */}
          <Button
            onClick={handleSend}
            disabled={
              loading || !input.trim()
            }
            className="
              bg-blue-500
              text-white
              hover:bg-blue-600
            "
            rightIcon={
              <SendIcon size={18} />
            }
          />
        </div>
      </div>
    </div>
  );
}