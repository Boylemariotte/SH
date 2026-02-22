import React, { useState } from 'react';
import { User, Lock, Mail, ArrowRight, Loader, ArrowLeft, Sparkles } from 'lucide-react';
import Button from './Button';
import Card from './Card';
import Input from './Input';

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
    <div className="min-h-screen flex items-center justify-center p-6 bg-white dark:bg-zinc-950 transition-colors duration-300 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-20 transition-opacity duration-300">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary-200/30 blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-secondary-200/30 blur-[100px]" />
      </div>

      <Card className="max-w-md w-11/12 animate-slide-up relative z-10" hoverEffect={false}>
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-surface-400 hover:text-primary-600 font-bold mb-8 transition-premium text-sm"
          >
            <ArrowLeft size={18} /> Volver
          </button>
        )}

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/20 mx-auto mb-6">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-surface-900 dark:text-surface-50 tracking-tight transition-colors">
            {isLogin ? '¡Hola de nuevo!' : 'Crea tu cuenta'}
          </h1>
          <p className="text-surface-500 dark:text-surface-400 font-medium mt-2 transition-colors">
            {isLogin ? 'Bienvenido a la nueva era del estudio.' : 'Únete a miles de estudiantes con IA.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <Input
              label="Nombre de Usuario"
              name="username"
              placeholder="Tu nombre"
              value={formData.username}
              onChange={handleChange}
              required={!isLogin}
              icon={User}
            />
          )}

          <Input
            label="Correo Electrónico"
            type="email"
            name="email"
            placeholder="ejemplo@correo.com"
            value={formData.email}
            onChange={handleChange}
            required
            icon={Mail}
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            icon={Lock}
          />

          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-xl text-rose-600 dark:text-rose-400 text-sm font-bold flex items-center gap-3 transition-colors">
              <span className="shrink-0">⚠️</span> {error}
            </div>
          )}

          <Button
            type="submit"
            isLoading={loading}
            className="w-full py-4 text-lg"
            icon={isLogin ? ArrowRight : Sparkles}
          >
            {isLogin ? 'Entrar' : 'Registrarse'}
          </Button>
        </form>

        <div className="mt-10 text-center text-sm font-medium text-surface-500 dark:text-surface-400 transition-colors">
          {isLogin ? '¿No tienes una cuenta? ' : '¿Ya tienes una cuenta? '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-primary-600 dark:text-primary-400 font-black hover:underline transition-colors"
          >
            {isLogin ? 'Regístrate' : 'Inicia Sesión'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AuthScreen;
