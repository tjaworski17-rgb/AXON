import { useState, useEffect, useRef } from 'react';
import { Bot, User, Copy, Check } from 'lucide-react';

export default function AIChat({ messages, isLoading }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const formatMessage = (text) => {
    return text
      .split('\n')
      .map((line, index) => (
        <span key={index}>
          {line}
          {index < text.split('\n').length - 1 && <br />}
        </span>
      ));
  };

  return (
    <div className="ai-chat">
      <div className="chat-header">
        <div className="header-content">
          <Bot size={24} className="bot-icon" />
          <h2>Axon AI Assistant</h2>
        </div>
        <p className="header-subtitle">
          Twój inteligentny asystent do automatyzacji i optymalizacji procesów biznesowych
        </p>
      </div>

      <div className="messages-container">
        {messages.length === 0 && (
          <div className="welcome-message">
            <Bot size={48} className="welcome-icon" />
            <h3>Witaj w Axon!</h3>
            <p>
              Jestem Twoim asystentem AI specjalizującym się w automatyzacji procesów biznesowych.
              Nagrywaj swoje pytania głosowo, a ja pomogę Ci znaleźć najlepsze rozwiązania.
            </p>
            <div className="capabilities">
              <div className="capability">
                <strong>🎯 Analiza procesów</strong>
                <span>Identyfikuję obszary do automatyzacji</span>
              </div>
              <div className="capability">
                <strong>🤖 Rozwiązania AI</strong>
                <span>Proponuję konkretne narzędzia i implementacje</span>
              </div>
              <div className="capability">
                <strong>📈 ROI i efektywność</strong>
                <span>Skupiam się na wymiernych korzyściach biznesowych</span>
              </div>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-header">
              {message.role === 'user' ? (
                <User size={20} className="message-icon user-icon" />
              ) : (
                <Bot size={20} className="message-icon bot-icon" />
              )}
              <span className="message-role">
                {message.role === 'user' ? 'Ty' : 'Axon'}
              </span>
              {message.role === 'assistant' && (
                <button
                  onClick={() => copyToClipboard(message.content, index)}
                  className="copy-button"
                  title="Skopiuj odpowiedź"
                >
                  {copiedIndex === index ? (
                    <Check size={16} className="copy-icon success" />
                  ) : (
                    <Copy size={16} className="copy-icon" />
                  )}
                </button>
              )}
            </div>
            <div className="message-content">
              {message.role === 'user' && message.transcription && (
                <div className="transcription-note">
                  <small>Transkrypcja głosu:</small>
                </div>
              )}
              <p>{formatMessage(message.content)}</p>
              {message.confidence && (
                <div className="confidence-indicator">
                  <small>Pewność transkrypcji: {Math.round(message.confidence * 100)}%</small>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message assistant loading">
            <div className="message-header">
              <Bot size={20} className="message-icon bot-icon" />
              <span className="message-role">Axon</span>
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <style jsx>{`
        .ai-chat {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .chat-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          text-align: center;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .header-content h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .bot-icon {
          color: #fbbf24;
        }

        .header-subtitle {
          margin: 0;
          opacity: 0.9;
          font-size: 0.95rem;
        }

        .messages-container {
          max-height: 600px;
          overflow-y: auto;
          padding: 1rem;
        }

        .welcome-message {
          text-align: center;
          padding: 2rem;
          color: #6b7280;
        }

        .welcome-icon {
          color: #667eea;
          margin-bottom: 1rem;
        }

        .welcome-message h3 {
          color: #374151;
          margin: 0 0 1rem 0;
          font-size: 1.25rem;
        }

        .welcome-message p {
          margin: 0 0 2rem 0;
          line-height: 1.6;
        }

        .capabilities {
          display: grid;
          gap: 1rem;
          max-width: 500px;
          margin: 0 auto;
        }

        .capability {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          text-align: left;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .capability strong {
          color: #374151;
          font-size: 0.9rem;
        }

        .capability span {
          font-size: 0.85rem;
          color: #6b7280;
        }

        .message {
          margin-bottom: 1.5rem;
          padding: 1rem;
          border-radius: 12px;
          max-width: 85%;
        }

        .message.user {
          background: #eff6ff;
          border: 1px solid #dbeafe;
          margin-left: auto;
        }

        .message.assistant {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          margin-right: auto;
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .message-role {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .user-icon {
          color: #3b82f6;
        }

        .copy-button {
          margin-left: auto;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .copy-button:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .copy-icon {
          color: #6b7280;
        }

        .copy-icon.success {
          color: #10b981;
        }

        .message-content p {
          margin: 0;
          line-height: 1.6;
          color: #374151;
        }

        .transcription-note {
          margin-bottom: 0.5rem;
        }

        .transcription-note small {
          color: #6b7280;
          font-style: italic;
        }

        .confidence-indicator {
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        .confidence-indicator small {
          color: #6b7280;
        }

        .typing-indicator {
          display: flex;
          gap: 0.25rem;
          align-items: center;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #6b7280;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(1) {
          animation-delay: -0.32s;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .ai-chat {
            margin: 1rem;
          }
          
          .chat-header {
            padding: 1.5rem;
          }
          
          .message {
            max-width: 95%;
            padding: 0.75rem;
          }
          
          .capabilities {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
