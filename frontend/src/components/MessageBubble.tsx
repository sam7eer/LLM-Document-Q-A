import ReactMarkdown from 'react-markdown';
import type { Message } from '../hooks/useChat';
import { SourceCard } from './SourceCard';
import { Bot, User } from 'lucide-react';

export function MessageBubble({ message }: { message: Message, isStreaming: boolean }) {
  const isUser = message.role === 'user';
  
  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      padding: '1.5rem',
      backgroundColor: isUser ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
      borderBottom: isUser ? 'none' : '1px solid var(--border-color)',
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: isUser ? 'var(--bg-hover)' : 'rgba(99, 102, 241, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {isUser ? <User size={20} color="var(--text-muted)" /> : <Bot size={20} color="var(--accent-blue)" />}
      </div>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Author Name */}
        <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
          {isUser ? 'You' : 'DocuMind'}
        </div>
        
        {/* Message Content */}
        <div className="message-content" style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          {isUser ? (
            <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
          ) : (
            <>
              {message.content ? (
                <div>
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '24px' }}>
                  <span className="dot" style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--accent-blue)', animation: 'pulse 1.4s infinite' }}></span>
                  <span className="dot" style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--accent-blue)', animation: 'pulse 1.4s infinite 0.2s' }}></span>
                  <span className="dot" style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--accent-blue)', animation: 'pulse 1.4s infinite 0.4s' }}></span>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Sources */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
              Sources
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {message.sources.map((source, idx) => (
                <SourceCard key={idx} source={source} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .message-content pre {
          background-color: var(--bg-card);
          padding: 1rem;
          border-radius: var(--radius-md);
          overflow-x: auto;
          border: 1px solid var(--border-color);
        }
        .message-content code {
          background-color: rgba(255,255,255,0.1);
          padding: 0.2em 0.4em;
          border-radius: var(--radius-sm);
          font-family: monospace;
          font-size: 0.9em;
        }
        .message-content pre code {
          background-color: transparent;
          padding: 0;
        }
        .message-content a {
          color: var(--accent-blue);
          text-decoration: none;
        }
        .message-content a:hover {
          text-decoration: underline;
        }
        .message-content p {
          margin-bottom: 0.75em;
        }
        .message-content p:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}
