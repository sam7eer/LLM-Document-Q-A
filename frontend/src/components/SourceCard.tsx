import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Source } from '../hooks/useChat';

export function SourceCard({ source, index }: { source: Source, index: number }) {
  const [expanded, setExpanded] = useState(false);
  
  // Calculate confidence percentage based on cosine similarity
  // 0.65 threshold to 1.0 -> map to roughly 50% to 100%
  const confidence = Math.min(100, Math.max(0, Math.round(source.score * 100)));
  
  let confidenceColor = 'var(--accent-green)';
  if (confidence < 75) confidenceColor = '#F59E0B'; // amber
  
  return (
    <div style={{
      marginTop: '0.5rem',
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      fontSize: '0.875rem'
    }}>
      <div 
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 0.75rem',
          cursor: 'pointer',
          backgroundColor: expanded ? 'var(--bg-hover)' : 'var(--bg-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ 
            backgroundColor: 'var(--border-color)', 
            color: 'var(--text-main)',
            width: '18px', 
            height: '18px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: '50%',
            fontSize: '0.7rem',
            fontWeight: 700
          }}>{index + 1}</span>
          
          <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>
            {source.doc_name} 
            {source.page ? ` (Page ${source.page})` : ''}
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color: confidenceColor, fontSize: '0.75rem', fontWeight: 600 }}>
            {confidence}% Match
          </span>
          {expanded ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
        </div>
      </div>
      
      {expanded && (
        <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
          <p style={{ margin: 0, fontStyle: 'italic', lineHeight: 1.6 }}>"...{source.text}..."</p>
        </div>
      )}
    </div>
  );
}
