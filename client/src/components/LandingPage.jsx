import React from 'react';
import { Sparkles, BookOpen, FileText, Trophy, Zap, Target, Award, ArrowRight, BarChart, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'Quizzes con IA',
      description: 'Genera quizzes personalizados sobre cualquier tema usando inteligencia artificial',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: BookOpen,
      title: 'Guías de Estudio',
      description: 'Crea guías de estudio detalladas adaptadas a tu nivel de conocimiento',
      gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'
    },
    {
      icon: FileText,
      title: 'Estudia desde Archivos',
      description: 'Sube tus apuntes y genera contenido educativo personalizado',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    {
      icon: Trophy,
      title: 'Sistema de Puntos',
      description: 'Gana puntos completando quizzes y compite en el ranking',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
    },
    {
      icon: BarChart,
      title: 'Estadísticas Detalladas',
      description: 'Rastrea tu progreso, rachas diarias y precisión en tus respuestas',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'
    },
    {
      icon: Target,
      title: 'Múltiples Dificultades',
      description: 'Desde principiante hasta experto, elige el nivel que mejor se adapte a ti',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #8b5cf6 100%)',
      padding: '2rem 1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Hero Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        padding: '4rem 1rem',
        color: 'white',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          marginBottom: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <Sparkles size={60} color="white" />
        </div>
        
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: '800',
          marginBottom: '1rem',
          lineHeight: '1.2',
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
        }}>
          Aprende de Forma Inteligente
        </h1>
        
        <p style={{
          fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
          marginBottom: '2rem',
          opacity: 0.95,
          maxWidth: '700px',
          margin: '0 auto 2rem auto',
          lineHeight: '1.6'
        }}>
          Plataforma de aprendizaje gamificado con IA que genera quizzes personalizados, 
          guías de estudio y te ayuda a alcanzar tus objetivos educativos.
        </p>

        <Link
          to="/register"
          className="duo-btn duo-btn-success"
          style={{
            maxWidth: '300px',
            margin: '0 auto',
            fontSize: '1.1rem',
            padding: '1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            textDecoration: 'none'
          }}
        >
          Comenzar Ahora
          <ArrowRight size={24} />
        </Link>
      </div>

      {/* Features Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: '800',
          color: 'white',
          marginBottom: '3rem',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
        }}>
          Características Principales
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="duo-card"
                style={{
                  textAlign: 'left',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(59, 130, 246, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.2), 0 0 100px rgba(59, 130, 246, 0.1)';
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: feature.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}>
                  <IconComponent size={30} color="white" />
                </div>
                
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#1e293b',
                  marginBottom: '0.75rem'
                }}>
                  {feature.title}
                </h3>
                
                <p style={{
                  color: '#64748b',
                  fontSize: '1rem',
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '3rem 1rem',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{
              fontSize: '3rem',
              fontWeight: '800',
              color: 'white',
              marginBottom: '0.5rem'
            }}>
              IA
            </div>
            <div style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              Generación Inteligente
            </div>
          </div>
          
          <div>
            <div style={{
              fontSize: '3rem',
              fontWeight: '800',
              color: 'white',
              marginBottom: '0.5rem'
            }}>
              ∞
            </div>
            <div style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              Temas Ilimitados
            </div>
          </div>
          
          <div>
            <div style={{
              fontSize: '3rem',
              fontWeight: '800',
              color: 'white',
              marginBottom: '0.5rem'
            }}>
              🎯
            </div>
            <div style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              Aprendizaje Personalizado
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '3rem 1rem',
        textAlign: 'center'
      }}>
        <div className="duo-card" style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)'
          }}>
            <TrendingUp size={40} color="white" />
          </div>
          
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: '#1e293b',
            marginBottom: '1rem'
          }}>
            ¿Listo para Comenzar?
          </h2>
          
          <p style={{
            color: '#64748b',
            fontSize: '1.1rem',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Únete a nuestra comunidad de estudiantes y comienza tu viaje de aprendizaje 
            personalizado hoy mismo. Es completamente gratis.
          </p>
          
          <Link
            to="/register"
            className="duo-btn duo-btn-success"
            style={{
              maxWidth: '300px',
              margin: '0 auto',
              fontSize: '1.1rem',
              padding: '1rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              textDecoration: 'none'
            }}
          >
            Crear Cuenta Gratis
            <ArrowRight size={24} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

