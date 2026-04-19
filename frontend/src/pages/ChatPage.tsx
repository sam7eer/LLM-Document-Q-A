import { ChatBox } from '../components/ChatBox';

export function ChatPage() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        padding: '1.25rem 2rem',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-panel)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Q&A Session</h1>
        <div style={{ 
          fontSize: '0.875rem', 
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          color: 'var(--accent-green)',
          padding: '0.25rem 0.75rem',
          borderRadius: '99px',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ width: 8, height: 8, backgroundColor: 'var(--accent-green)', borderRadius: '50%' }}></span>
          Ready
        </div>
      </header>
      
      {/* Main chat interface */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <ChatBox />
      </div>
    </div>
  );
}
