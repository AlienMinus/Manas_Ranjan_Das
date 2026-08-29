import React, { useState, useEffect, useRef } from "react";
import { search, updateRagContext } from "../chatbot/rag";
import { usePortfolio } from "../context/usePortfolio";
import {
  FaRobot,
  FaPaperPlane,
  FaTimes,
  FaFilePdf,
  FaFileDownload,
  FaExternalLinkAlt,
  FaGithub,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaPhoneAlt,
  FaBlog,
} from "react-icons/fa";

const QUICK_PROMPTS = [
  "Show me your projects",
  "What are your technical skills?",
  "Can I see your resume?",
  "Tell me about your experience",
  "How can I contact Manas?",
];

const INITIAL_MESSAGES = [
  {
    text: "Hi there! I’m Minus Assistant 🤖\nAsk me anything about Manas's projects, skills, research, experience, or resume!",
    sender: "bot",
  },
];

const ChatBot = () => {
  const portfolio = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [docPreviewOpen, setDocPreviewOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (portfolio) {
      updateRagContext(portfolio);
    }
  }, [portfolio]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isThinking, isOpen, docPreviewOpen]);

  const handleSendQuery = (queryText) => {
    const query = (queryText || input).trim();
    if (!query) return;

    // Add user message
    setMessages((prev) => [...prev, { text: query, sender: "user" }]);
    setInput("");
    setIsThinking(true);

    setTimeout(() => {
      const result = search(query);
      setMessages((prev) => [
        ...prev,
        {
          text: result.text,
          payload: result,
          sender: "bot",
        },
      ]);
      setIsThinking(false);
    }, 220);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendQuery();
    }
  };

  // Helper to render rich payload cards
  const renderBotPayload = (payload) => {
    if (!payload) return null;

    // 1. Projects 3D Cards
    if (payload.type === "projects" && Array.isArray(payload.items)) {
      return (
        <div className="chat-cards-container">
          {payload.items.map((proj) => (
            <div className="chat-3d-card" key={proj.title}>
              <div className="chat-project-header">
                <span className="chat-project-title">{proj.title}</span>
              </div>
              <p className="chat-project-desc">{proj.description}</p>

              {proj.tags && (
                <div className="chat-project-tags">
                  {proj.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="chat-project-actions">
                {proj.github && (
                  <a
                    href={proj.github}
                    target="_blank"
                    rel="noreferrer"
                    className="btn outline sm"
                    style={{ padding: "0.3rem 0.65rem", fontSize: "0.75rem" }}
                  >
                    <FaGithub size={11} />
                    <span>Code</span>
                  </a>
                )}
                {proj.demo && (
                  <a
                    href={proj.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="btn primary sm"
                    style={{ padding: "0.3rem 0.65rem", fontSize: "0.75rem" }}
                  >
                    <FaExternalLinkAlt size={10} />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // 2. Skills 3D Cards
    if (payload.type === "skills" && Array.isArray(payload.items)) {
      return (
        <div className="chat-cards-container">
          {payload.items.map((cat) => (
            <div className="chat-skill-category" key={cat.category}>
              <div className="chat-skill-cat-title">{cat.category}</div>
              <div className="chat-skill-chips">
                {(cat.items || []).map((s) => (
                  <span key={s.name} className="tag">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // 3. Resume / Document 3D Card
    if (payload.type === "resume" && payload.doc) {
      const { doc } = payload;
      return (
        <div className="chat-cards-container">
          <div className="chat-doc-card">
            <div className="chat-doc-header">
              <span className="chat-doc-title">
                <FaFilePdf style={{ color: "var(--accent-neon)" }} />
                <span>{doc.title}</span>
              </span>
              <span className="badge badge--emerald">Verified PDF</span>
            </div>

            {doc.highlights && (
              <ul className="chat-doc-highlights">
                {doc.highlights.map((h, i) => (
                  <li key={i} className="chat-doc-highlight-item">
                    {h}
                  </li>
                ))}
              </ul>
            )}

            <div className="chat-doc-actions">
              <a
                href={doc.url}
                download="Manas_Ranjan_Das_Resume.pdf"
                className="btn primary sm"
              >
                <FaFileDownload size={12} />
                <span>Download CV</span>
              </a>

              <a
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                className="btn outline sm"
              >
                <FaExternalLinkAlt size={11} />
                <span>Open Full</span>
              </a>

              <button
                type="button"
                className="btn outline sm"
                onClick={() => setDocPreviewOpen((prev) => !prev)}
              >
                {docPreviewOpen ? <FaEyeSlash size={11} /> : <FaEye size={11} />}
                <span>{docPreviewOpen ? "Hide Embed" : "Preview In-Chat"}</span>
              </button>
            </div>

            {/* Embedded In-Chat Doc Frame */}
            {docPreviewOpen && (
              <div className="chat-doc-preview-frame">
                <iframe
                  src={`${doc.url}#toolbar=0&navpanes=0`}
                  title="In-Chat Resume Preview"
                  style={{ width: "100%", height: "100%", border: "none" }}
                />
              </div>
            )}
          </div>
        </div>
      );
    }

    // 4. Experience 3D Cards
    if (payload.type === "experience" && Array.isArray(payload.items)) {
      return (
        <div className="chat-cards-container">
          {payload.items.map((exp, idx) => (
            <div className="chat-exp-card" key={idx}>
              <span className="chat-exp-role">{exp.role}</span>
              <span className="chat-exp-company">{exp.company}</span>
              <span className="chat-exp-duration">{exp.duration}</span>
            </div>
          ))}
        </div>
      );
    }

    // 5. Contact 3D Cards
    if (payload.type === "contact" && payload.contact) {
      const c = payload.contact;
      return (
        <div className="chat-cards-container">
          <div className="chat-3d-card">
            {c.email && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                <FaEnvelope style={{ color: "var(--accent-neon)" }} />
                <a href={`mailto:${c.email}`} style={{ color: "var(--text-primary)" }}>
                  {c.email}
                </a>
              </div>
            )}
            {c.phone && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                <FaPhoneAlt style={{ color: "var(--accent-neon)" }} />
                <a href={`tel:${c.phone}`} style={{ color: "var(--text-primary)" }}>
                  {c.phone}
                </a>
              </div>
            )}
            {c.blog && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                <FaBlog style={{ color: "var(--accent-neon)" }} />
                <a href={c.blog} target="_blank" rel="noreferrer" style={{ color: "var(--accent-neon)" }}>
                  Spectacular Minus Blog
                </a>
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
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
        <div className="chatbot" role="dialog" aria-label="AI Assistant Window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header__title">
              <FaRobot size={18} style={{ color: "var(--accent-neon)" }} />
              <h3>Minus Assistant</h3>
              <span className="badge badge--emerald">AI 3D Cards</span>
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
                {msg.text && (
                  <div>
                    {msg.text.split("\n").map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                )}
                {renderBotPayload(msg.payload)}
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
              placeholder="Ask about projects, skills, resume..."
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
