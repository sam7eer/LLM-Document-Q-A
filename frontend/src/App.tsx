import { useState, useEffect } from 'react';
import { DocumentUpload } from './components/DocumentUpload';
import { DocumentList } from './components/DocumentList';
import { ChatBox } from './components/ChatBox';
import { DocumentAPI, type Document } from './api/client';
import { BrainCircuit } from 'lucide-react';

function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const docs = await DocumentAPI.list();
      setDocuments(docs);
    } catch (err) {
      console.error('Failed to fetch documents', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="app-container">
      {/* Left Sidebar for Documents */}
      <aside className="sidebar" style={{ width: '300px', display: 'flex', flexDirection: 'column' }}>
        <div className="sidebar-logo" style={{ marginBottom: '1.5rem' }}>
          <BrainCircuit size={28} color="var(--accent-blue)" />
          <span>DocuMind</span>
        </div>
        
        <div style={{ flexShrink: 0 }}>
            <DocumentUpload onUploadComplete={fetchDocuments} compact={true} />
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', marginTop: '1.5rem', paddingRight: '0.25rem' }}>
            <h3 style={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: 'var(--text-muted)', 
                marginBottom: '0.75rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em' 
            }}>
                Library
            </h3>
            <DocumentList documents={documents} isLoading={isLoading} onDelete={fetchDocuments} />
        </div>
      </aside>
      
      {/* Right Main Area for Chat */}
      <main className="main-content">
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
            API Ready
            </div>
        </header>

        <div style={{ flex: 1, overflow: 'hidden' }}>
            <ChatBox />
        </div>
      </main>
    </div>
  );
}

export default App;
