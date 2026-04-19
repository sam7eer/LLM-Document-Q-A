import { useState, useEffect } from 'react';
import { DocumentUpload } from '../components/DocumentUpload';
import { DocumentList } from '../components/DocumentList';
import { type Document, DocumentAPI } from '../api/client';

export function DocumentsPage() {
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
    <div className="page-container animate-fade-in">
      <h1 className="page-title">Document Library</h1>
      <p className="page-subtitle">Upload documents here to provide context for the Q&A agent.</p>
      
      <DocumentUpload onUploadComplete={fetchDocuments} />
      
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>Indexed Documents</h2>
        <DocumentList 
          documents={documents} 
          isLoading={isLoading} 
          onDelete={fetchDocuments} 
        />
      </div>
    </div>
  );
}
