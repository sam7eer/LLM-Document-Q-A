import { Trash2, FileText, Database } from 'lucide-react';
import { type Document, DocumentAPI } from '../api/client';

interface DocumentListProps {
  documents: Document[];
  onDelete: () => void;
  isLoading: boolean;
}

export function DocumentList({ documents, onDelete, isLoading }: DocumentListProps) {
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this document and its embeddings?')) {
      await DocumentAPI.delete(id);
      onDelete();
    }
  };

  if (isLoading) {
    return <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>Loading documents...</div>;
  }

  if (documents.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem 1rem', 
        backgroundColor: 'var(--bg-card)', 
        borderRadius: 'var(--radius-md)',
        border: '1px dashed var(--border-color)'
      }}>
        <Database size={24} color="var(--border-color)" style={{ marginBottom: '0.5rem' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>No documents yet</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {documents.map((doc) => (
        <div key={doc.id} style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
            <FileText size={16} color="var(--accent-blue)" style={{ flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span style={{ 
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--text-main)',
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis'
              }} title={doc.name}>
                {doc.name}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {doc.chunks} chunks
              </span>
            </div>
          </div>
          
          <button 
            onClick={(e) => handleDelete(doc.id, e)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.25rem',
              flexShrink: 0
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-danger)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            title="Delete document"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
