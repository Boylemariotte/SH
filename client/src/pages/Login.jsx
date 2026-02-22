import React, { useState } from 'react';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
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

      login(data);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-100/40 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-100/40 blur-[100px]" />
      </div>

      <div className="max-w-md w-full relative z-10 animate-slide-up">
        <Card className="p-10 border-white/80">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/20">
              <Lock size={36} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-surface-900 tracking-tight mb-2">
              Bienvenido
            </h1>
            <p className="text-surface-500 font-medium">
              Inicia sesión para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Correo Electrónico"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nombre@ejemplo.com"
              required
            />

            <Input
              label="Contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            {error && (
              <div className="p-4 bg-accent-rose/10 border border-accent-rose/20 rounded-xl text-sm text-accent-rose font-bold flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-4 text-lg"
              isLoading={loading}
              icon={ArrowRight}
            >
              Entrar
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-surface-200 text-center">
            <p className="text-surface-500 font-medium">
              ¿No tienes una cuenta?{' '}
              <Link
                to="/register"
                className="text-primary-600 font-bold hover:text-primary-700 hover:underline transition-premium"
              >
                Regístrate gratis
              </Link>
            </p>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm font-bold text-surface-400 hover:text-primary-600 transition-premium">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

