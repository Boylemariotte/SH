import React from 'react';
import { X } from 'lucide-react';
import { StudyIcons } from './Icon';

const MobileSidebar = ({ isOpen, onClose, currentScreen, onNavigate }) => {
  const NAV_ITEMS = [
    { id: 'input', label: 'Modo Quiz', icon: <StudyIcons.nav.quiz /> },
    { id: 'guide_input', label: 'Guía IA', icon: <StudyIcons.nav.guide /> },
    { id: 'study_from_file', label: 'Estudiar Archivo', icon: <StudyIcons.nav.study /> },
    { id: 'stats', label: 'Estadísticas', icon: <StudyIcons.nav.stats /> },
    { id: 'history', label: 'Historial', icon: <StudyIcons.ui.menu /> },
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
            <StudyIcons.ui.close />
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
