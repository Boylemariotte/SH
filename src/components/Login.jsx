import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Sparkles, LogIn } from 'lucide-react';
import TiltCard from './TiltCard';
import AIRevealText from './AIRevealText';

const Login = ({ onLogin, onBack, onSwitchToRegister }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            onLogin({
                username: formData.email.split('@')[0],
                email: formData.email
            });
            setLoading(false);
        }, 1500);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="auth-container animate-fade-in-up">
            <button className="btn-back-landing" onClick={onBack}>
                Volver
            </button>

            <TiltCard className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        <Sparkles size={32} className="text-accent" />
                    </div>
                    <h2 className="auth-title">
                        <AIRevealText text="Bienvenido de nuevo" scrambleSpeed={30} />
                    </h2>
                    <p className="auth-subtitle">
                        Ingresa para continuar tu aprendizaje
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group animate-fade-in-up stagger-1">
                        <label className="form-label">Correo electrónico</label>
                        <div className="auth-input-wrapper">
                            <Mail size={18} className="auth-input-icon" />
                            <input
                                type="email"
                                name="email"
                                className="form-input auth-input"
                                placeholder="correo@ejemplo.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group animate-fade-in-up stagger-2">
                        <label className="form-label">Contraseña</label>
                        <div className="auth-input-wrapper">
                            <Lock size={18} className="auth-input-icon" />
                            <input
                                type="password"
                                name="password"
                                className="form-input auth-input"
                                placeholder="•••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-shimmer btn-block auth-submit-btn animate-fade-in-up stagger-3"
                        disabled={loading}
                    >
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                <div className="spinner-small" /> Procesando...
                            </span>
                        ) : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                <LogIn size={18} />
                                Iniciar Sesión
                            </span>
                        )}
                    </button>
                </form>

                <div className="auth-footer animate-fade-in-up stagger-4">
                    <p>
                        ¿No tienes una cuenta?
                        <button
                            className="auth-link-btn"
                            onClick={onSwitchToRegister}
                        >
                            Regístrate aquí
                        </button>
                    </p>
                </div>
            </TiltCard>
        </div>
    );
};

export default Login;
