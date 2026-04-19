import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { MessageBubble } from './MessageBubble';

export function ChatBox() {
  const { messages, sendMessage, isStreaming } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    
    sendMessage(input);
    setInput('');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--bg-app)',
      position: 'relative'
    }}>
      
      {/* Scrollable Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        paddingBottom: '2rem'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {messages.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem 1rem', 
              color: 'var(--text-muted)' 
            }}>
              <h2 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Ask DocuMind</h2>
              <p>Ask a question, and I'll find the answer in your uploaded documents.</p>
            </div>
          ) : (
            messages.map(msg => (
              <MessageBubble 
                key={msg.id} 
                message={msg} 
                isStreaming={isStreaming && msg.id === messages[messages.length - 1].id} 
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'var(--bg-app)',
        borderTop: '1px solid var(--border-color)',
        borderLeft: '1px solid var(--border-color)', // match sidebar
      }}>
        <form 
          onSubmit={handleSubmit}
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            display: 'flex',
            gap: '1rem',
            position: 'relative'
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isStreaming ? "Wait for response..." : "Ask a question about your documents..."}
            disabled={isStreaming}
            style={{
              flex: 1,
              padding: '1rem 1.25rem',
              paddingRight: '4rem',
              backgroundColor: 'var(--bg-panel)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              color: 'var(--text-main)',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-blue)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            style={{
              position: 'absolute',
              right: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: input.trim() && !isStreaming ? 'var(--accent-blue)' : 'var(--bg-hover)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: input.trim() && !isStreaming ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease'
            }}
          >
            <Send size={18} style={{ marginLeft: '-2px' }} />
          </button>
        </form>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.75rem' }}>
          DocuMind can make mistakes. Always verify its answers.
        </div>
      </div>
    </div>
  );
}
