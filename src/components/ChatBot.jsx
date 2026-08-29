// src/components/ChatBot.jsx
import React, { useState, useEffect, useRef } from "react";
import { search } from "../chatbot/rag";
import { FaRobot, FaPaperPlane, FaTimes } from "react-icons/fa";

const QUICK_PROMPTS = [
  "What are your top projects?",
  "What are your technical skills?",
  "Tell me about your research papers",
  "How can I contact Manas?",
];

const INITIAL_MESSAGES = [
  {
    text: "Hi there! I'm Minus Assistant 🤖\nAsk me anything about Manas's projects, skills, research, experience, or contact details.",
    sender: "bot",
  },
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isThinking, isOpen]);

  const handleSendQuery = (queryText) => {
    const query = (queryText || input).trim();
    if (!query) return;

    // Add user message
    setMessages((prev) => [...prev, { text: query, sender: "user" }]);
    setInput("");
    setIsThinking(true);

    setTimeout(() => {
      const results = search(query);
      const botResponse = results.join("\n");
      setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
      setIsThinking(false);
    }, 180);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendQuery();
    }
  };

  return (
    <div>
      {/* Floating Launcher Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="chatbot-toggler"
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
        title="Chat with AI Assistant"
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </button>

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="chatbot" role="dialog" aria-label="AI Search Assistant">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header__title">
              <FaRobot size={18} style={{ color: "var(--accent-cyan)" }} />
              <h3>Minus Assistant</h3>
              <span className="badge">AI RAG</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="chatbot-close"
              aria-label="Close chatbot window"
            >
              <FaTimes size={13} />
            </button>
          </div>

          {/* Message List */}
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            ))}

            {isThinking && (
              <div className="message bot">
                <div className="typing-dots">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}

            {/* Quick Suggestion Chips on First Load */}
            {messages.length === 1 && !isThinking && (
              <div className="chatbot-suggestions">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="suggestion-chip"
                    onClick={() => handleSendQuery(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about skills, projects, research..."
              aria-label="Type your message"
            />
            <button
              type="button"
              onClick={() => handleSendQuery()}
              className="chatbot-send-btn"
              aria-label="Send message"
              disabled={!input.trim() || isThinking}
            >
              <FaPaperPlane size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
