import React, { useState } from 'react';
import { User, Lock, Mail, ArrowRight, Loader, ArrowLeft } from 'lucide-react';

const AuthScreen = ({ onLogin, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getApiUrl = () => {
    if (import.meta.env.PROD) {
      return import.meta.env.VITE_API_URL || 'http://localhost:5000';
    }
    return 'http://localhost:5000';
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const url = `${getApiUrl()}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isLogin ? {
          email: formData.email,
          password: formData.password
        } : formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en la autenticación');
      }

      // Guardar token y usuario
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
    }}>
      <div className="duo-card" style={{ maxWidth: '400px', width: '100%', position: 'relative' }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '500',
              padding: '0.5rem',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f3f4f6';
              e.currentTarget.style.color = '#3b82f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            <ArrowLeft size={18} />
            Volver
          </button>
        )}
        <div className="duo-header">
          <div className="duo-avatar" style={{ background: 'linear-gradient(135deg, #6B46C1 0%, #805AD5 100%)' }}>
            <User className="duo-avatar-icon" color="white" />
          </div>
          <h1 className="duo-title">{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h1>
          <p className="duo-subtitle">
            {isLogin ? 'Bienvenido de nuevo' : 'Únete a nosotros para aprender'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="duo-input-group">
              <label className="duo-label">Nombre de Usuario</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="duo-input"
                  style={{ paddingLeft: '36px' }}
                  placeholder="Tu nombre"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="duo-input-group">
            <label className="duo-label">Correo Electrónico</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="duo-input"
                style={{ paddingLeft: '36px' }}
                placeholder="ejemplo@correo.com"
                required
              />
            </div>
          </div>

          <div className="duo-input-group">
            <label className="duo-label">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="duo-input"
                style={{ paddingLeft: '36px' }}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          {error && (
            <div className="duo-alert duo-alert-error" style={{ marginBottom: '1rem', padding: '0.75rem', fontSize: '0.9rem' }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="duo-btn duo-btn-success"
            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
          >
            {loading ? <Loader className="animate-spin" size={20} /> : (isLogin ? 'Entrar' : 'Registrarse')}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#6b7280' }}>
          {isLogin ? '¿No tienes una cuenta? ' : '¿Ya tienes una cuenta? '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#6B46C1', 
              fontWeight: '600', 
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? 'Regístrate' : 'Inicia Sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;

