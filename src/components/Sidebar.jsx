import React from 'react';
import { LogOut } from 'lucide-react';
import PointsDisplay from './PointsDisplay';
import { APP_CONFIG } from '../constants/appConfig';

function Sidebar({ screen, onNavigate, totalPoints, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-text">{APP_CONFIG.name}</span>
        <div className="sidebar-logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 8.54l4.24 4.24M20.46 15.46l-4.24 4.24M8.54 1.54l-4.24 4.24"></path>
          </svg>
        </div>
      </div>

      <nav className="sidebar-nav">
        {[
          { id: 'input', label: 'Modo Quiz', icon: '⚡' },
          { id: 'guide_input', label: 'Guía de Estudio', icon: '📚' },
          { id: 'study_from_file', label: 'Subir Archivo', icon: '📄' },
          { id: 'stats', label: 'Estadísticas', icon: '📊' },
        ].map(item => (
          <button
            key={item.id}
            className={`sidebar-nav-item ${screen === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-points">
          <PointsDisplay totalPoints={totalPoints} />
        </div>
        <button className="sidebar-logout-btn" onClick={onLogout}>
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
