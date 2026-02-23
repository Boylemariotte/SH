import { Sparkles, ArrowRight, BookOpen, Zap, Trophy, Shield } from 'lucide-react';
import TiltCard from './TiltCard';

const LandingPage = ({ onGetStarted }) => {
    return (
        <div className="landing-container">
            {/* Background Effects */}
            <div className="landing-glow landing-glow-1"></div>
            <div className="landing-glow landing-glow-2"></div>

            {/* Navigation */}
            <nav className="landing-nav">
                <div className="landing-logo">
                    <Sparkles className="logo-icon" />
                    <span>StudySmart AI</span>
                </div>
                <div className="landing-nav-links">
                    <a href="#features">Características</a>
                    <a href="#about">Acerca de</a>
                    <button className="btn-start-small" onClick={onGetStarted}>
                        Entrar <ArrowRight size={16} />
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="landing-hero">
                <div className="hero-badge animate-fade-in-up stagger-1">
                    <Zap size={14} className="badge-icon" />
                    <span>Potenciado por Inteligencia Artificial</span>
                </div>
                <h1 className="hero-title animate-fade-in-up stagger-2">
                    Domina cualquier tema <br />
                    con <span className="gradient-text">Inteligencia Artificial</span>
                </h1>
                <p className="hero-subtitle animate-fade-in-up stagger-3">
                    La plataforma definitiva para estudiantes, profesionales y mentes curiosas.
                    Genera quizzes personalizados, guías de estudio y analiza tus archivos en segundos.
                </p>
                <div className="hero-btns animate-fade-in-up stagger-4">
                    <button className="btn-get-started btn-shimmer" onClick={onGetStarted}>
                        Comenzar Gratis <ArrowRight size={20} />
                    </button>
                    <button className="btn-demo">
                        Ver Demo
                    </button>
                </div>
            </header>

            {/* Features Preview */}
            <section className="landing-features animate-fade-in-up stagger-5" id="features">
                <TiltCard className="feature-card">
                    <div className="feature-icon-wrapper purple">
                        <Zap size={24} />
                    </div>
                    <h3>Quizzes Dinámicos</h3>
                    <p>Preguntas generadas por IA que se adaptan a tu nivel y tema de interés.</p>
                </TiltCard>
                <TiltCard className="feature-card">
                    <div className="feature-icon-wrapper blue">
                        <BookOpen size={24} />
                    </div>
                    <h3>Guías de Estudio</h3>
                    <p>Convierte temas complejos en guías estructuradas y fáciles de entender.</p>
                </TiltCard>
                <TiltCard className="feature-card">
                    <div className="feature-icon-wrapper gold">
                        <Trophy size={24} />
                    </div>
                    <h3>Sistema de Puntos</h3>
                    <p>Gamifica tu aprendizaje. Gana puntos, mantén tu racha y alcanza tus metas.</p>
                </TiltCard>
            </section>

            {/* Footer Basic */}
            <footer className="landing-footer">
                <p>© 2024 StudySmart AI. Desarrollado para el futuro del aprendizaje.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
