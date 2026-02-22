import React, { useState, useEffect } from 'react';
import { Sparkles, BookOpen, FileText, Trophy, Zap, Target, Award, ArrowRight, BarChart, TrendingUp, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, description, colorClass }) => (
  <div className="card-premium group dark:bg-zinc-900/50 dark:border-white/5 transition-all duration-300">
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg transition-premium group-hover:scale-110 ${colorClass}`}>
      <Icon size={28} className="text-white" />
    </div>
    <h3 className="text-xl font-bold text-surface-900 dark:text-surface-50 mb-3 tracking-tight transition-colors">{title}</h3>
    <p className="text-surface-600 dark:text-surface-400 leading-relaxed transition-colors">{description}</p>
  </div>
);

const LandingPage = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const features = [
    {
      icon: Sparkles,
      title: 'Quizzes con IA',
      description: 'Genera quizzes personalizados sobre cualquier tema usando inteligencia artificial avanzada.',
      colorClass: 'bg-gradient-to-br from-primary-400 to-primary-600 shadow-primary-500/20'
    },
    {
      icon: BookOpen,
      title: 'Guías de Estudio',
      description: 'Crea guías de estudio detalladas adaptadas exactamente a tu nivel de conocimiento.',
      colorClass: 'bg-gradient-to-br from-secondary-400 to-secondary-600 shadow-secondary-500/20'
    },
    {
      icon: FileText,
      title: 'Estudia desde Archivos',
      description: 'Sube tus apuntes y deja que nuestra IA extraiga lo más importante por ti.',
      colorClass: 'bg-gradient-to-br from-accent-emerald to-emerald-700 shadow-emerald-500/20'
    },
    {
      icon: Trophy,
      title: 'Sistema de Puntos',
      description: 'Gamifica tu aprendizaje. Gana puntos, sube de nivel y compite en el ranking.',
      colorClass: 'bg-gradient-to-br from-accent-amber to-orange-600 shadow-amber-500/20'
    },
    {
      icon: BarChart,
      title: 'Estadísticas Reales',
      description: 'Visualiza tu progreso con gráficas detalladas de tu rendimiento y constancia.',
      colorClass: 'bg-gradient-to-br from-primary-500 to-secondary-600 shadow-primary-500/20'
    },
    {
      icon: Target,
      title: 'Dificultad Dinámica',
      description: 'Desde principiante hasta experto, el contenido se ajusta a tu ritmo de aprendizaje.',
      colorClass: 'bg-gradient-to-br from-accent-indigo to-primary-700 shadow-indigo-500/20'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-surface-900 dark:text-surface-50 overflow-x-hidden transition-colors duration-300">
      {/* Hero Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-200/30 dark:bg-primary-500/10 blur-[100px] transition-colors" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-200/30 dark:bg-secondary-500/10 blur-[100px] transition-colors" />
      </div>

      {/* Navbar equivalent / Top padding */}
      <nav className="relative z-50 max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-11 h-11 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Sparkles size={26} className="text-white" />
          </div>
          <span className="text-2xl font-black text-surface-900 dark:text-surface-50 tracking-tighter uppercase">Study<span className="text-primary-600">Hub</span></span>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 text-surface-500 dark:text-surface-400 hover:text-primary-600 transition-premium border border-surface-100 dark:border-white/5"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link to="/login" className="px-6 py-2.5 font-semibold text-surface-600 dark:text-surface-400 hover:text-primary-600 transition-premium hidden md:block">
            Iniciar Sesión
          </Link>
          <Link to="/register" className="px-6 py-2.5 font-bold bg-primary-600 text-white rounded-xl shadow-lg hover:bg-primary-700 hover:-translate-y-0.5 transition-premium">
            Empezar Gratis
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 text-primary-700 dark:text-primary-400 text-sm font-bold mb-8 animate-slide-up">
          <Zap size={16} /> NUEVA GENERACIÓN DE APRENDIZAJE
        </div>

        <h1 className="text-6xl md:text-7xl font-black text-surface-900 dark:text-surface-50 leading-[1.1] mb-8 tracking-tight animate-slide-up transition-colors" style={{ animationDelay: '0.1s' }}>
          Domina cualquier tema <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">con Inteligencia Artificial.</span>
        </h1>

        <p className="text-xl text-surface-600 dark:text-surface-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up transition-colors" style={{ animationDelay: '0.2s' }}>
          Plataforma gamificada que transforma tus apuntes en quizzes, guías de estudio y metas alcanzables. Aprende más rápido, retén más contenido.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white font-bold rounded-2xl shadow-xl hover:bg-primary-700 hover:-translate-y-1 transition-premium flex items-center justify-center gap-2 text-lg">
            Crear cuenta ahora <ArrowRight size={22} />
          </Link>
          <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-zinc-900 text-surface-700 dark:text-surface-300 font-bold rounded-2xl shadow-md border border-surface-200 dark:border-white/5 hover:bg-surface-50 dark:hover:bg-zinc-800 transition-premium text-lg">
            Ver demostración
          </button>
        </div>
      </header>

      {/* Social Proof / Stats */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 mb-32">
        <div className="glass rounded-[2rem] p-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-center border-white/50 transition-all duration-300">
          <div>
            <div className="text-4xl font-black text-primary-600 mb-2">100% IA</div>
            <p className="text-surface-500 dark:text-surface-500 font-medium uppercase tracking-widest text-xs transition-colors">Tecnología de Vanguardia</p>
          </div>
          <div className="border-y md:border-y-0 md:border-x border-surface-200 dark:border-white/10 py-8 md:py-0 transition-colors">
            <div className="text-4xl font-black text-secondary-600 mb-2">∞ Temas</div>
            <p className="text-surface-500 dark:text-surface-500 font-medium uppercase tracking-widest text-xs transition-colors">Sin límites de conocimiento</p>
          </div>
          <div>
            <div className="text-4xl font-black text-accent-amber mb-2">Gamificado</div>
            <p className="text-surface-500 dark:text-surface-500 font-medium uppercase tracking-widest text-xs transition-colors">Aprendizaje Divertido</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 mb-32">
        <div className="text-center mb-20 animate-slide-up">
          <h2 className="text-4xl font-black text-surface-900 dark:text-surface-50 mb-4 transition-colors">Potenciado por algoritmos avanzados</h2>
          <p className="text-surface-600 dark:text-surface-400 max-w-xl mx-auto transition-colors">Diseñamos una suite de herramientas específicamente para maximizar tu capacidad de retención.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-32">
        <div className="bg-primary-600 rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 transition-premium group-hover:scale-150" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-400/20 rounded-full blur-3xl -ml-32 -mb-32 transition-premium group-hover:scale-150" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6">¿Preparado para subir de nivel?</h2>
            <p className="text-xl text-primary-100 mb-12 max-w-2xl mx-auto">Únete a miles de estudiantes que ya están transformando su manera de estudiar. El futuro de la educación es personalizado.</p>
            <Link to="/register" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-primary-600 font-black rounded-2xl shadow-xl hover:scale-105 transition-premium text-lg">
              Comenzar gratis hoy <TrendingUp size={24} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-t border-surface-200 dark:border-white/5 transition-colors">
        <div className="flex flex-col md:row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50 grayscale dark:invert">
            <Sparkles size={20} />
            <span className="font-bold tracking-tighter">STUDYHUB</span>
          </div>
          <div className="text-surface-400 dark:text-surface-600 text-sm transition-colors">
            © {new Date().getFullYear()} StudyHub. Potenciado por Inteligencia Artificial.
          </div>
          <div className="flex gap-6 text-surface-500 dark:text-surface-500 font-medium text-sm transition-colors">
            <a href="#" className="hover:text-primary-600 transition-premium">Privacidad</a>
            <a href="#" className="hover:text-primary-600 transition-premium">Términos</a>
            <a href="#" className="hover:text-primary-600 transition-premium">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
