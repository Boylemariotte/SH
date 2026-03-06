import React from 'react';
import { X, Sparkles, BookOpen, FileText, BarChart2, History } from 'lucide-react';

const MobileSidebar = ({ isOpen, onClose, currentScreen, onNavigate }) => {
  const NAV_ITEMS = [
    { id: 'input', label: 'Modo Quiz', icon: <Sparkles size={20} /> },
    { id: 'guide_input', label: 'Guía IA', icon: <BookOpen size={20} /> },
    { id: 'study_from_file', label: 'Estudiar Archivo', icon: <FileText size={20} /> },
    { id: 'stats', label: 'Estadísticas', icon: <BarChart2 size={20} /> },
    { id: 'history', label: 'Historial', icon: <History size={20} /> },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="mobile-sidebar-overlay"
        onClick={onClose}
      />
      
      {/* Sidebar móvil */}
      <div className="mobile-sidebar">
        <div className="mobile-sidebar-header">
          <h3>Study Helper</h3>
          <button 
            className="mobile-sidebar-close"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="mobile-sidebar-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`mobile-nav-item ${currentScreen === item.id ? 'active' : ''}`}
              onClick={() => {
                onNavigate(item.id);
                onClose();
              }}
            >
              <span className="mobile-nav-icon">{item.icon}</span>
              <span className="mobile-nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default MobileSidebar;
