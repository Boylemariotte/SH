import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Sparkles, UserPlus } from 'lucide-react';
import TiltCard from './TiltCard';
import AIRevealText from './AIRevealText';

const Register = ({ onRegister, onBack, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Validar formato de email
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validar campos
        const newErrors = {};
        
        if (!formData.username.trim()) {
            newErrors.username = 'El nombre de usuario es requerido';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'El correo electrónico es requerido';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Ingrese un correo electrónico válido';
        }
        
        if (!formData.password.trim()) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        setLoading(true);
        setErrors({});

        // Simulate API call
        setTimeout(() => {
            onRegister({
                username: formData.username,
                email: formData.email
            });
            setLoading(false);
        }, 1500);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Limpiar error del campo cuando el usuario empieza a escribir
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
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
                        <AIRevealText text="Crea tu cuenta" scrambleSpeed={30} />
                    </h2>
                    <p className="auth-subtitle">
                        Únete a la nueva era del estudio con IA
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group animate-fade-in-up stagger-1">
                        <label className="form-label">Nombre de usuario</label>
                        <div className="auth-input-wrapper">
                            <User size={18} className="auth-input-icon" />
                            <input
                                type="text"
                                name="username"
                                className={`form-input auth-input ${errors.username ? 'error' : ''}`}
                                placeholder="Tu nombre"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {errors.username && (
                            <div className="error-message">
                                {errors.username}
                            </div>
                        )}
                    </div>

                    <div className="form-group animate-fade-in-up stagger-2">
                        <label className="form-label">Correo electrónico</label>
                        <div className="auth-input-wrapper">
                            <Mail size={18} className="auth-input-icon" />
                            <input
                                type="email"
                                name="email"
                                className={`form-input auth-input ${errors.email ? 'error' : ''}`}
                                placeholder="correo@ejemplo.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {errors.email && (
                            <div className="error-message">
                                {errors.email}
                            </div>
                        )}
                    </div>

                    <div className="form-group animate-fade-in-up stagger-3">
                        <label className="form-label">Contraseña</label>
                        <div className="auth-input-wrapper">
                            <Lock size={18} className="auth-input-icon" />
                            <input
                                type="password"
                                name="password"
                                className={`form-input auth-input ${errors.password ? 'error' : ''}`}
                                placeholder="•••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {errors.password && (
                            <div className="error-message">
                                {errors.password}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-shimmer btn-block auth-submit-btn animate-fade-in-up stagger-4"
                        disabled={loading}
                    >
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                <div className="spinner-small" /> Procesando...
                            </span>
                        ) : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                <UserPlus size={18} />
                                Registrarse
                            </span>
                        )}
                    </button>
                </form>

                <div className="auth-footer animate-fade-in-up stagger-5">
                    <p>
                        ¿Ya tienes una cuenta?
                        <button
                            className="auth-link-btn"
                            onClick={onSwitchToLogin}
                        >
                            Inicia sesión
                        </button>
                    </p>
                </div>
            </TiltCard>
        </div>
    );
};

export default Register;
