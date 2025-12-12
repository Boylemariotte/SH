import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Loader } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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

    const url = `${getApiUrl()}/api/auth/login`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en la autenticación');
      }

      // Guardar token y usuario
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      // Redirigir al dashboard
      navigate('/');
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
      <div className="duo-card" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="duo-header">
          <div className="duo-avatar" style={{ background: 'linear-gradient(135deg, #6B46C1 0%, #805AD5 100%)' }}>
            <Lock className="duo-avatar-icon" color="white" />
          </div>
          <h1 className="duo-title">Iniciar Sesión</h1>
          <p className="duo-subtitle">Bienvenido de nuevo</p>
        </div>

        <form onSubmit={handleSubmit}>
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
            {loading ? <Loader className="animate-spin" size={20} /> : 'Entrar'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#6b7280' }}>
          ¿No tienes una cuenta?{' '}
          <Link to="/register" style={{ 
            color: '#6B46C1', 
            fontWeight: '600', 
            textDecoration: 'underline',
            cursor: 'pointer'
          }}>
            Regístrate
          </Link>
        </div>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Link to="/" style={{ 
            color: '#6b7280', 
            fontSize: '0.9rem',
            textDecoration: 'none'
          }}>
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

