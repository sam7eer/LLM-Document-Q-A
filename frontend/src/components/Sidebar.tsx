import { FileText, MessageSquare, BrainCircuit } from 'lucide-react';

interface SidebarProps {
  currentPage: 'documents' | 'chat';
  onNavigate: (page: 'documents' | 'chat') => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <BrainCircuit size={28} color="var(--accent-blue)" />
        <span>DocuMind</span>
      </div>
      
      <nav className="sidebar-nav">
        <button 
          className={`nav-item ${currentPage === 'documents' ? 'active' : ''}`}
          onClick={() => onNavigate('documents')}
        >
          <FileText size={20} />
          Documents Library
        </button>
        
        <button 
          className={`nav-item ${currentPage === 'chat' ? 'active' : ''}`}
          onClick={() => onNavigate('chat')}
        >
          <MessageSquare size={20} />
          Q&A Chat
        </button>
      </nav>
    </aside>
  );
}
