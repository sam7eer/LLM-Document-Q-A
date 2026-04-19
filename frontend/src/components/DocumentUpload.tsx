import { useState, useRef } from 'react';
import { UploadCloud, AlertCircle } from 'lucide-react';
import { DocumentAPI } from '../api/client';

interface DocumentUploadProps {
  onUploadComplete: () => void;
  compact?: boolean;
}

export function DocumentUpload({ onUploadComplete, compact = false }: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await uploadFile(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      await DocumentAPI.upload(file);
      onUploadComplete();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div
        className="upload-zone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: '2px dashed var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: compact ? '1.5rem 1rem' : '3rem 2rem',
          textAlign: 'center',
          backgroundColor: 'var(--bg-card)',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-blue)'}
        onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept=".pdf,.docx,.txt,.md"
        />

        {isUploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div className="spinner"><UploadCloud size={compact ? 24 : 40} color="var(--accent-blue)" /></div>
            <p style={{ color: 'var(--text-main)', fontSize: '0.875rem' }}>Processing...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <UploadCloud size={compact ? 24 : 40} color="var(--text-muted)" />
            <p style={{ color: 'var(--text-main)', fontSize: compact ? '0.875rem' : '1.25rem', fontWeight: 500 }}>
              {compact ? 'Upload Document' : 'Click or drag to upload'}
            </p>
          </div>
        )}
      </div>

      {error && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.75rem',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid var(--accent-danger)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--accent-danger)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem'
        }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{error}</span>
        </div>
      )}
    </div>
  );
}
