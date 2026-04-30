import { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import aiIcon from "@/asset/icons/ai.svg";

export default function AiChat({ initialMessage }) {
  const [messages, setMessages] = useState([
    { type: "ai", text: "Hello, how can I help you?" },
  ]);

  const [input, setInput] = useState("");
  const chatRef = useRef(null);
  const hasSentInitial = useRef(false);

  // ✅ MEMOIZED FUNCTION (IMPORTANT FIX)
  const sendMessage = useCallback((customMessage) => {
    const messageToSend = customMessage || input;

    if (!messageToSend.trim()) return;

    setMessages((prev) => [
      ...prev,
      { type: "user", text: messageToSend },
    ]);

    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: "I'm analyzing your request and will suggest the best skincare routine shortly.",
        },
      ]);
    }, 800);
  }, [input]);

  // ✅ SAFE EFFECT (NO WARNING)
  useEffect(() => {
    if (initialMessage && !hasSentInitial.current) {
      const timer = setTimeout(() => {
        sendMessage(initialMessage);
        hasSentInitial.current = true;
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [initialMessage, sendMessage]);

  // ✅ AUTO SCROLL
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="h-full bg-[#F5F5F5] flex flex-col justify-between p-4">

      {/* CHAT */}
      <div
        ref={chatRef}
        className="flex-1 flex flex-col gap-6 overflow-y-auto px-2"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-3 ${
              msg.type === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {msg.type === "ai" && (
              <div className="w-10 h-10 rounded-full bg-[#524E8D] flex items-center justify-center">
                <img src={aiIcon} alt="ai" className="w-5 h-5" />
              </div>
            )}

            <div
              className={`max-w-[65%] p-4 rounded-[25px] shadow-sm ${
                msg.type === "user"
                  ? "bg-[#ECE4FF]"
                  : "bg-[#EDE7F6]"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="flex items-center gap-3 mt-4">

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && sendMessage()
          }
          placeholder="Ask anything about your skin..."
          className="flex-1 px-5 py-4 rounded-[20px] outline-none
          bg-[#ECE4FF] border-2 border-[#524E8D]"
        />

        <button
          onClick={() => sendMessage()}
          className="bg-[#524E8D] p-4 rounded-xl flex items-center justify-center hover:opacity-90 transition"
        >
          <img src={aiIcon} alt="ai" className="w-6 h-6" />
        </button>

      </div>
    </div>
  );
}

/* ✅ PROP VALIDATION (fix warning) */
AiChat.propTypes = {
  initialMessage: PropTypes.string,
};