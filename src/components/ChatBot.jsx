// src/components/ChatBot.jsx
import React, { useState, useEffect } from "react";
import { search } from "../chatbot/rag";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  // Initial greeting when chat opens first time
  useEffect(() => {
    if (!isOpen || messages.length > 0) return;
    setMessages([
      {
        text: "Hi, I’m Minus Bot 🤖\nAsk me about my skills, projects, experience, education or how to contact Manas.",
        sender: "bot",
      },
    ]);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = () => {
    const query = input.trim();
    if (!query) return;

    // Add user message
    setMessages((prev) => [...prev, { text: query, sender: "user" }]);
    setInput("");
    setIsThinking(true);

    // Simulate thinking + avoid using stale state
    setTimeout(() => {
      const results = search(query);
      const botResponse = results.join("\n");
      setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
      setIsThinking(false);
    }, 150); // tiny delay for nicer UX
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="chatbot-toggler"
        aria-label="Toggle chatbot"
      >
        <span className="material-symbols-rounded">🤖</span>
      </button>

      {isOpen && (
        <div className="chatbot">
          <div className="chatbot-header">
            <h2>Minus Bot</h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="chatbot-close"
              aria-label="Close chatbot"
            >
              &times;
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender}`}
              >
                {msg.text.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            ))}
            {isThinking && (
              <div className="message bot">
                <em>Thinking…</em>
              </div>
            )}
          </div>

          <div className="chatbot-input">
            <input
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about Manas..."
            />
            <button type="button" onClick={handleSend}>
              ⫸
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
