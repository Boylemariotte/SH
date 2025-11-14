import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowLeft, ChevronDown, ChevronUp, Book, Link as LinkIcon } from 'lucide-react';
import '../styles/guideStyles.css';

const GuideViewer = ({ guide, onBack }) => {
  const [expandedSections, setExpandedSections] = useState({});
  
  // Inicializar todas las secciones como expandidas
  useEffect(() => {
    const sections = {
      introduccion: true,
      conceptos: true,
      ejemplos: true,
      aplicaciones: true,
      preguntas: true,
      bibliografia: true
    };
    setExpandedSections(sections);
  }, [guide]);
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Función para formatear el texto con saltos de línea
  const formatGuideText = (text) => {
    if (!text) return [];
    
    // Dividir por secciones principales
    const sections = {
      introduccion: '',
      conceptos: '',
      ejemplos: '',
      aplicaciones: '',
      recursos: ''
    };
    
    let currentSection = null;
    
    text.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      
      // Identificar secciones principales
      if (trimmedLine.toLowerCase().includes('introducción') || 
          trimmedLine.toLowerCase().includes('introduccion')) {
        currentSection = 'introduccion';
        sections[currentSection] += line + '\n';
      } else if (trimmedLine.toLowerCase().includes('conceptos clave')) {
        currentSection = 'conceptos';
        sections[currentSection] += line + '\n';
      } else if (trimmedLine.toLowerCase().includes('ejemplos prácticos') || 
                 trimmedLine.toLowerCase().includes('ejemplos practicos')) {
        currentSection = 'ejemplos';
        sections[currentSection] += line + '\n';
      } else if (trimmedLine.toLowerCase().includes('aplicaciones') || 
                 trimmedLine.toLowerCase().includes('aplicación')) {
        currentSection = 'aplicaciones';
        sections[currentSection] += line + '\n';
      } else if (trimmedLine.toLowerCase().includes('recursos') || 
                 trimmedLine.toLowerCase().includes('bibliografía') ||
                 trimmedLine.toLowerCase().includes('bibliografia')) {
        currentSection = 'recursos';
        sections[currentSection] += line + '\n';
      } else if (currentSection) {
        sections[currentSection] += line + '\n';
      }
    });
    
    // Generar preguntas clave basadas en el contenido
    const generateKeyQuestions = () => {
      const questions = [];
      const content = text.toLowerCase();
      
      if (content.includes('definición') || content.includes('definicion')) {
        questions.push(`¿Cuál es la definición precisa de ${guide.topic}?`);
      }
      if (content.includes('importancia') || content.includes('relevancia')) {
        questions.push(`¿Por qué es importante estudiar ${guide.topic}?`);
      }
      if (content.includes('aplicac') || content.includes('uso')) {
        questions.push(`¿Cuáles son las principales aplicaciones de ${guide.topic}?`);
      }
      if (content.includes('ejemplo') || content.includes('caso de uso')) {
        questions.push(`¿Puedes darme un ejemplo práctico de ${guide.topic}?`);
      }
      if (content.includes('historia') || content.includes('origen')) {
        questions.push(`¿Cuál es el origen o historia de ${guide.topic}?`);
      }
      
      // Asegurarse de tener al menos 3 preguntas
      while (questions.length < 3) {
        questions.push(`¿Cuáles son los aspectos más relevantes de ${guide.topic}?`);
      }
      
      return questions;
    };
    
    // Generar bibliografía específica según el tema
    const generateBibliography = () => {
      const topic = guide.topic.toLowerCase();
      const bibliografia = [];
      
      // Mapeo de temas a recursos específicos
      const topicResources = {
        // Matemáticas
        'matemática': [
          {
            title: "Cálculo de una variable",
            author: "James Stewart",
            type: "Libro de texto",
            description: "Un clásico para el estudio del cálculo diferencial e integral."
          },
          {
            title: "Álgebra Lineal y sus Aplicaciones",
            author: "David C. Lay",
            type: "Libro de texto",
            description: "Excelente recurso para entender los conceptos fundamentales del álgebra lineal."
          },
          {
            title: "Khan Academy - Matemáticas",
            author: "khanacademy.org/math",
            type: "Recurso en línea",
            description: "Lecciones gratuitas de matemáticas desde aritmética hasta cálculo.",
            url: "https://www.khanacademy.org/math"
          }
        ],
        'matematica': 'matemática',
        'cálculo': 'matemática',
        'álgebra': 'matemática',
        'geometría': 'matemática',
        'estadística': 'matemática',
        'trigonometría': 'matemática',
        
        // Programación
        'programación': [
          {
            title: "Clean Code: A Handbook of Agile Software Craftsmanship",
            author: "Robert C. Martin",
            type: "Libro técnico",
            description: "Fundamentos para escribir código limpio y mantenible."
          },
          {
            title: "El programador pragmático",
            author: "Andrew Hunt, David Thomas",
            type: "Libro técnico",
            description: "Consejos prácticos para convertirse en un programador más efectivo."
          },
          {
            title: "freeCodeCamp",
            author: "freecodecamp.org",
            type: "Plataforma de aprendizaje",
            description: "Cursos gratuitos de programación con proyectos prácticos.",
            url: "https://www.freecodecamp.org/"
          }
        ],
        'programacion': 'programación',
        'código': 'programación',
        'javascript': 'programación',
        'python': 'programación',
        'java': 'programación',
        'web development': 'programación',
        'desarrollo web': 'programación',
        
        // Ciencias de la computación
        'algoritmo': [
          {
            title: "Introduction to Algorithms",
            author: "Thomas H. Cormen",
            type: "Libro de texto",
            description: "Conocido como CLRS, es una referencia estándar en algoritmos."
          },
          {
            title: "GeeksforGeeks",
            author: "geeksforgeeks.org",
            type: "Recurso en línea",
            description: "Explicaciones detalladas sobre algoritmos y estructuras de datos.",
            url: "https://www.geeksforgeeks.org/"
          }
        ],
        'estructura de datos': 'algoritmo',
        'ciencias de la computación': 'algoritmo',
        'computer science': 'algoritmo',
        
        // Historia
        'historia': [
          {
            title: "Sapiens: De animales a dioses",
            author: "Yuval Noah Harari",
            type: "Ensayo histórico",
            description: "Una visión general de la historia de la humanidad."
          },
          {
            title: "Armas, gérmenes y acero",
            author: "Jared Diamond",
            type: "Ensayo histórico",
            description: "Explora los patrones de la historia humana en los últimos 13,000 años."
          },
          {
            title: "Khan Academy - Historia",
            author: "khanacademy.org/humanities/history",
            type: "Recurso en línea",
            description: "Cursos gratuitos sobre historia mundial.",
            url: "https://www.khanacademy.org/humanities/history"
          }
        ],
        'historia universal': 'historia',
        'historia del mundo': 'historia',
        
        // Ciencia
        'ciencia': [
          {
            title: "Breve historia del tiempo",
            author: "Stephen Hawking",
            type: "Divulgación científica",
            description: "Una introducción accesible a conceptos complejos de la física moderna."
          },
          {
            title: "El gen egoísta",
            author: "Richard Dawkins",
            type: "Libro de divulgación",
            description: "Fundamentos de la evolución biológica desde la perspectiva genética."
          },
          {
            title: "ScienceDirect",
            author: "sciencedirect.com",
            type: "Base de datos científica",
            description: "Acceso a artículos de investigación científica.",
            url: "https://www.sciencedirect.com/"
          }
        ],
        'física': 'ciencia',
        'química': 'ciencia',
        'biología': 'ciencia',
        'astronomía': 'ciencia',
        'geología': 'ciencia',
        
        // Negocios y economía
        'economía': [
          {
            title: "Economía básica",
            author: "Thomas Sowell",
            type: "Libro de texto",
            description: "Introducción clara a los principios económicos fundamentales."
          },
          {
            title: "Investopedia",
            author: "investopedia.com",
            type: "Recurso en línea",
            description: "Diccionario y recursos educativos sobre economía y finanzas.",
            url: "https://www.investopedia.com/"
          }
        ],
        'economia': 'economía',
        'finanzas': 'economía',
        'negocios': 'economía',
        'emprendimiento': 'economía',
        
        // Psicología
        'psicología': [
          {
            title: "El poder de los hábitos",
            author: "Charles Duhigg",
            type: "Libro de divulgación",
            description: "Cómo se forman los hábitos y cómo podemos cambiarlos."
          },
          {
            title: "Psicología Hoy",
            author: "psicologia-online.com",
            type: "Recurso en línea",
            description: "Artículos y recursos sobre psicología y bienestar.",
            url: "https://www.psicologia-online.com/"
          }
        ],
        'psicologia': 'psicología',
        'mente': 'psicología',
        'comportamiento': 'psicología',
        
        // Idiomas
        'inglés': [
          {
            title: "English Grammar in Use",
            author: "Raymond Murphy",
            type: "Libro de texto",
            description: "Uno de los mejores recursos para aprender gramática inglesa."
          },
          {
            title: "Duolingo",
            author: "duolingo.com",
            type: "Aplicación",
            description: "Aprende inglés de forma gratuita con lecciones interactivas.",
            url: "https://www.duolingo.com/"
          },
          {
            title: "BBC Learning English",
            author: "bbc.co.uk/learningenglish",
            type: "Recurso en línea",
            description: "Cursos y materiales gratuitos de la BBC para aprender inglés.",
            url: "https://www.bbc.co.uk/learningenglish/"
          }
        ],
        'ingles': 'inglés',
        'francés': 'inglés',
        'francés': 'inglés',
        'alemán': 'inglés',
        'italiano': 'inglés',
        'portugués': 'inglés',
        'español': 'inglés',
        
        // Medicina
        'medicina': [
          {
            title: "Fisiología Médica",
            author: "Guyton y Hall",
            type: "Libro de texto",
            description: "Uno de los libros de fisiología más completos y utilizados."
          },
          {
            title: "Medscape",
            author: "medscape.com",
            type: "Recurso en línea",
            description: "Noticias, artículos y recursos médicos para profesionales.",
            url: "https://www.medscape.com/"
          },
          {
            title: "PubMed",
            author: "pubmed.ncbi.nlm.nih.gov",
            type: "Base de datos",
            description: "Acceso a millones de citas de literatura biomédica.",
            url: "https://pubmed.ncbi.nlm.nih.gov/"
          }
        ],
        'anatomía': 'medicina',
        'fisiología': 'medicina',
        'enfermería': 'medicina',
        
        // Derecho
        'derecho': [
          {
            title: "Introducción al Derecho",
            author: "Jorge Joaquín Llambías",
            type: "Libro de texto",
            description: "Excelente introducción a los conceptos fundamentales del derecho."
          },
          {
            title: "LegisPedia",
            author: "legispedia.com",
            type: "Recurso en línea",
            description: "Recursos y materiales de estudio para estudiantes de derecho.",
            url: "https://www.legispedia.com/"
          }
        ],
        'leyes': 'derecho',
        'constitucional': 'derecho',
        'penal': 'derecho',
        'civil': 'derecho',
        
        // Ingeniería
        'ingeniería': [
          {
            title: "Mecánica de materiales",
            author: "James M. Gere",
            type: "Libro de texto",
            description: "Clásico libro de texto sobre resistencia de materiales."
          },
          {
            title: "Engineering ToolBox",
            author: "engineeringtoolbox.com",
            type: "Recurso en línea",
            description: "Herramientas y recursos para ingenieros.",
            url: "https://www.engineeringtoolbox.com/"
          }
        ],
        'ingenieria': 'ingeniería',
        'mecánica': 'ingeniería',
        'eléctrica': 'ingeniería',
        'civil': 'ingeniería',
        'industrial': 'ingeniería',
        'sistemas': 'ingeniería',
        'informática': 'ingeniería',
        
        // Arte y diseño
        'arte': [
          {
            title: "El arte de mirar",
            author: "E. H. Gombrich",
            type: "Libro de arte",
            description: "Introducción accesible a la historia del arte."
          },
          {
            title: "Behance",
            author: "behance.net",
            type: "Plataforma en línea",
            description: "Muestra y descubre trabajos creativos.",
            url: "https://www.behance.net/"
          },
          {
            title: "Google Arts & Culture",
            author: "artsandculture.google.com",
            type: "Recurso en línea",
            description: "Explora obras de arte, colecciones y museos de todo el mundo.",
            url: "https://artsandculture.google.com/"
          }
        ],
        'diseño': 'arte',
        'pintura': 'arte',
        'escultura': 'arte',
        'fotografía': 'arte',
        'fotografia': 'arte',
        'gráfico': 'arte',
        'grafico': 'arte'
      };
      
      // Buscar recursos específicos para el tema
      let recursosEspecificos = [];
      
      // Primero buscamos coincidencias exactas
      for (const [key, value] of Object.entries(topicResources)) {
        if (topic.includes(key)) {
          if (Array.isArray(value)) {
            // Si es un array, son recursos directos
            recursosEspecificos = [...recursosEspecificos, ...value];
          } else if (typeof value === 'string' && topicResources[value]) {
            // Si es un string, es una referencia a otra categoría
            recursosEspecificos = [...recursosEspecificos, ...topicResources[value]];
          }
        }
      }
      
      // Si no encontramos recursos específicos, usamos una búsqueda más amplia
      if (recursosEspecificos.length === 0) {
        // Dividimos el tema en palabras clave
        const palabrasClave = topic.split(/\s+/);
        
        // Buscamos cada palabra clave en los recursos
        for (const palabra of palabrasClave) {
          if (palabra.length > 3) { // Ignorar palabras muy cortas
            for (const [key, value] of Object.entries(topicResources)) {
              if (key.includes(palabra) || palabra.includes(key)) {
                if (Array.isArray(value)) {
                  recursosEspecificos = [...new Set([...recursosEspecificos, ...value])];
                } else if (typeof value === 'string' && topicResources[value]) {
                  recursosEspecificos = [...new Set([...recursosEspecificos, ...topicResources[value]])];
                }
              }
            }
          }
        }
      }
      
      // Si aún no hay recursos específicos, usamos recursos generales
      if (recursosEspecificos.length === 0) {
        recursosEspecificos = [
          {
            title: "Cómo Aprendemos",
            author: "Stanislas Dehaene",
            type: "Libro",
            description: "Una exploración científica sobre los mecanismos del aprendizaje humano."
          },
          {
            title: "Aprender a Aprender",
            author: "Barbara Oakley",
            type: "Libro",
            description: "Técnicas efectivas para dominar temas difíciles."
          },
          {
            title: "Khan Academy",
            author: "khanacademy.org",
            type: "Plataforma educativa",
            description: "Recursos gratuitos sobre múltiples temas académicos.",
            url: "https://www.khanacademy.org/"
          },
          {
            title: "Coursera",
            author: "coursera.org",
            type: "Cursos en línea",
            description: "Cursos de universidades de todo el mundo sobre diversos temas.",
            url: "https://www.coursera.org/"
          },
          {
            title: "edX",
            author: "edx.org",
            type: "Cursos en línea",
            description: "Cursos de las mejores universidades del mundo.",
            url: "https://www.edx.org/"
          },
          {
            title: "Google Académico",
            author: "scholar.google.com",
            type: "Buscador académico",
            description: "Busca artículos académicos sobre cualquier tema.",
            url: "https://scholar.google.com/"
          },
          {
            title: "ResearchGate",
            author: "researchgate.net",
            type: "Red académica",
            description: "Conecta con investigadores y accede a publicaciones.",
            url: "https://www.researchgate.net/"
          },
          {
            title: "MIT OpenCourseWare",
            author: "ocw.mit.edu",
            type: "Recursos educativos",
            description: "Materiales de cursos del MIT gratuitos en línea.",
            url: "https://ocw.mit.edu/"
          },
          {
            title: "TED-Ed",
            author: "ed.ted.com",
            type: "Videos educativos",
            description: "Lecciones en video sobre una amplia variedad de temas.",
            url: "https://ed.ted.com/"
          },
          {
            title: "Project Gutenberg",
            author: "gutenberg.org",
            type: "Biblioteca digital",
            description: "Más de 60,000 libros electrónicos gratuitos.",
            url: "https://www.gutenberg.org/"
          }
        ];
      }
      
      // Limitar a 10 recursos como máximo
      return recursosEspecificos.slice(0, 10);
    };
    
    const keyQuestions = generateKeyQuestions();
    const bibliography = generateBibliography();
    
    // Función para renderizar el contenido de una sección
    const renderSectionContent = (content) => {
      if (!content) return null;
      
      return content
        .split('\n')
        .filter(line => line.trim() !== '')
        .map((line, index) => {
          // Títulos de sección
          if (line.trim().match(/^[A-ZÁÉÍÓÚÑ][^:]+:$/)) {
            return <h3 key={index} className="guide-section-title">{line}</h3>;
          }
          // Subtítulos
          else if (line.trim().startsWith('## ')) {
            return <h4 key={index} className="guide-subsection-title">{line.substring(3)}</h4>;
          }
          // Listas numeradas
          else if (/^\d+\.\s/.test(line.trim())) {
            return <p key={index} className="guide-list-item">{line}</p>;
          }
          // Listas con viñetas
          else if (line.trim().startsWith('- ')) {
            return <p key={index} className="guide-bullet-item">• {line.substring(2)}</p>;
          }
          // Texto en negrita
          else if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
            return <p key={index} className="guide-important">{line.replace(/\*\*/g, '')}</p>;
          }
          // Párrafos normales
          return <p key={index} className="guide-paragraph">{line}</p>;
        });
    };
    
    return (
      <>
        {/* Columna izquierda - Contenido principal */}
        <div className="guide-main-column">
          {/* Sección de Introducción */}
          <div className="guide-section">
            <div 
              className="guide-section-header" 
              onClick={() => toggleSection('introduccion')}
            >
              <h2>📖 Introducción</h2>
              {expandedSections.introduccion ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {expandedSections.introduccion && (
              <div className="guide-section-content">
                {sections.introduccion ? (
                  renderSectionContent(sections.introduccion)
                ) : (
                  <p>No hay contenido de introducción disponible.</p>
                )}
              </div>
            )}
          </div>
          
          {/* Sección de Conceptos Clave */}
          <div className="guide-section">
            <div 
              className="guide-section-header" 
              onClick={() => toggleSection('conceptos')}
            >
              <h2>🔑 Conceptos Clave</h2>
              {expandedSections.conceptos ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {expandedSections.conceptos && (
              <div className="guide-section-content">
                {sections.conceptos ? (
                  renderSectionContent(sections.conceptos)
                ) : (
                  <p>No hay conceptos clave disponibles.</p>
                )}
              </div>
            )}
          </div>
          
          {/* Sección de Ejemplos */}
          <div className="guide-section">
            <div 
              className="guide-section-header" 
              onClick={() => toggleSection('ejemplos')}
            >
              <h2>📝 Ejemplos Prácticos</h2>
              {expandedSections.ejemplos ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {expandedSections.ejemplos && (
              <div className="guide-section-content">
                {sections.ejemplos ? (
                  renderSectionContent(sections.ejemplos)
                ) : (
                  <p>No hay ejemplos disponibles.</p>
                )}
              </div>
            )}
          </div>
          
          {/* Sección de Aplicaciones */}
          <div className="guide-section">
            <div 
              className="guide-section-header" 
              onClick={() => toggleSection('aplicaciones')}
            >
              <h2>🌍 Aplicaciones</h2>
              {expandedSections.aplicaciones ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {expandedSections.aplicaciones && (
              <div className="guide-section-content">
                {sections.aplicaciones ? (
                  renderSectionContent(sections.aplicaciones)
                ) : (
                  <p>No hay información de aplicaciones disponibles.</p>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Columna derecha - Recursos y preguntas */}
        <div className="guide-sidebar-column">
          {/* Preguntas Clave */}
          <div className="guide-section">
            <div 
              className="guide-section-header" 
              onClick={() => toggleSection('preguntas')}
            >
              <h2>❓ Preguntas Clave</h2>
              {expandedSections.preguntas ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {expandedSections.preguntas && (
              <div className="guide-section-content">
                <div className="key-questions">
                  <p>Evalúa tu comprensión del tema:</p>
                  <ul>
                    {keyQuestions.map((question, index) => (
                      <li key={index} className="key-question">
                        <span className="question-number">{index + 1}.</span>
                        <span className="question-text">{question}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="study-tip">
                    💡 Responde sin mirar la guía
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Bibliografía */}
          <div className="guide-section">
            <div 
              className="guide-section-header" 
              onClick={() => toggleSection('bibliografia')}
            >
              <h2>📚 Recursos</h2>
              {expandedSections.bibliografia ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {expandedSections.bibliografia && (
              <div className="guide-section-content">
                <div className="bibliography">
                  <h3>Libros:</h3>
                  <div className="book-list">
                    {bibliography.filter(item => item.type.includes('Libro')).map((item, index) => (
                      <div key={index} className="book-item">
                        <div className="book-icon">
                          <Book size={18} />
                        </div>
                        <div className="book-details">
                          <div className="book-title">{item.title}</div>
                          <div className="book-author">{item.author}</div>
                          <div className="book-description">{item.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <h3>En línea:</h3>
                  <div className="online-resources">
                    {bibliography.filter(item => !item.type.includes('Libro')).map((item, index) => (
                      <a 
                        key={index} 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="resource-link"
                      >
                        <LinkIcon size={14} style={{ marginRight: '6px' }} />
                        <span>
                          <strong>{item.title}</strong>
                          <br />
                          <small>{item.description}</small>
                        </span>
                      </a>
                    ))}
                  </div>
                  
                  <div className="citation-note">
                    <p>📌 Cita estos recursos en trabajos académicos</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="guide-container">
      <button 
        onClick={onBack}
        className="back-button"
        aria-label="Volver al menú principal"
      >
        <ArrowLeft size={20} style={{ marginRight: '8px' }} />
        Volver al menú
      </button>
      
      <div className="guide-header">
        <div className="guide-icon">
          <BookOpen size={40} />
        </div>
        <div>
          <h1 className="guide-title">{guide.topic}</h1>
          <div className="guide-meta">
            <span className="guide-difficulty">
              <span className="meta-label">Nivel:</span> {getDifficultyLabel(guide.difficulty)}
            </span>
            <span className="guide-date">
              <span className="meta-label">Generada el:</span> {new Date().toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>
      
      <div className="guide-content">
        {guide.content ? (
          <div className="guide-text">
            {formatGuideText(guide.content)}
          </div>
        ) : (
          <div className="guide-loading">
            <div className="guide-loading-spinner"></div>
            <p>Generando tu guía de estudio...</p>
          </div>
        )}
      </div>
      
      <div className="guide-actions">
        <button 
          onClick={() => window.print()}
          className="print-button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Imprimir guía
        </button>
        <button 
          onClick={() => {
            const element = document.createElement('a');
            const file = new Blob([document.querySelector('.guide-content').innerText], {type: 'text/plain'});
            element.href = URL.createObjectURL(file);
            element.download = `Guia-de-Estudio-${guide.topic.replace(/\s+/g, '-')}.txt`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          }}
          className="download-button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Descargar como TXT
        </button>
      </div>
      
      <div className="guide-footer">
        <p>© {new Date().getFullYear()} Study Helper con IA - Herramienta educativa</p>
      </div>
    </div>
  );
};

// Función auxiliar para mostrar etiquetas amigables de dificultad
const getDifficultyLabel = (difficulty) => {
  const labels = {
    facil: '😊 Principiante',
    medio: '🧠 Intermedio',
    dificil: '🔥 Avanzado',
    experto: '💎 Experto'
  };
  return labels[difficulty] || difficulty;
};

export default React.memo(GuideViewer);
