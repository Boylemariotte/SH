import React, { useState } from 'react';
import { Menu, X, Sparkles, BookOpen, FileText, BarChart2, History, LogOut, Trophy } from 'lucide-react';

const Navbar = ({ 
  currentScreen, 
  onNavigate, 
  totalPoints, 
  onLogout, 
  currentUser 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const NAV_ITEMS = [
    { id: 'input', label: 'Modo Quiz', icon: <Sparkles size={20} /> },
    { id: 'guide_input', label: 'Guía IA', icon: <BookOpen size={20} /> },
    { id: 'study_from_file', label: 'Estudiar Archivo', icon: <FileText size={20} /> },
    { id: 'stats', label: 'Estadísticas', icon: <BarChart2 size={20} /> },
    { id: 'history', label: 'Historial', icon: <History size={20} /> },
  ];

  const handleNavClick = (screenId) => {
    onNavigate(screenId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Navbar Desktop */}
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo y Brand */}
          <div className="navbar-brand">
            <div className="navbar-logo">
              <Sparkles size={24} />
              <span>Study Helper</span>
            </div>
          </div>

          {/* Navegación Desktop */}
          <div className="navbar-nav">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                className={`navbar-nav-item ${currentScreen === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="navbar-nav-icon">{item.icon}</span>
                <span className="navbar-nav-label">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Sección derecha - Puntos y Usuario */}
          <div className="navbar-actions">
            <div className="navbar-points">
              <Trophy size={18} />
              <span>{totalPoints}</span>
            </div>
            
            {currentUser && (
              <div className="navbar-user">
                <div className="navbar-avatar">
                  {currentUser.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <span className="navbar-username">{currentUser.name || 'Usuario'}</span>
              </div>
            )}

            <button 
              className="navbar-logout"
              onClick={onLogout}
              title="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
          </div>

          {/* Botón menú móvil */}
          <button 
            className="navbar-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Menú móvil desplegable */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu">
          <div className="mobile-menu-header">
            <div className="mobile-menu-brand">
              <Sparkles size={20} />
              <span>Study Helper</span>
            </div>
            <button 
              className="mobile-menu-close"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="mobile-menu-nav">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                className={`mobile-menu-item ${currentScreen === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="mobile-menu-icon">{item.icon}</span>
                <span className="mobile-menu-label">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="mobile-menu-footer">
            {currentUser && (
              <div className="mobile-menu-user">
                <div className="mobile-menu-avatar">
                  {currentUser.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                  <div className="mobile-menu-username">{currentUser.name || 'Usuario'}</div>
                  <div className="mobile-menu-points">
                    <Trophy size={16} />
                    <span>{totalPoints} puntos</span>
                  </div>
                </div>
              </div>
            )}
            
            <button 
              className="mobile-menu-logout"
              onClick={() => {
                onLogout();
                setIsMobileMenuOpen(false);
              }}
            >
              <LogOut size={18} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
