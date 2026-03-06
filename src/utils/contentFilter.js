// Sistema de filtrado de contenido para Study Helper
// Previene contenido malicioso, inapropiado o dañino

// Palabras y patrones prohibidos
const BLACKLIST = [
  // Contenido violento o dañino
  'matar', 'asesinar', 'suicidio', 'autolesión', 'herir', 'dañar', 
  'destruir', 'bomba', 'explosivo', 'arma', 'violencia', 'golpear',
  
  // Contenido sexual explícito
  'porno', 'sexo', 'sexual', 'desnudo', 'erótico', 'adulto',
  
  // Discriminación y odio
  'racista', 'homófobo', 'nazi', 'kkk', 'odio', 'discriminación',
  'supremacía', 'terrorismo', 'extremista',
  
  // Sustancias ilegales
  'droga', 'cocaína', 'heroína', 'metanfetamina', 'marihuana',
  'estupefaciente', 'alucinógeno',
  
  // Fraude y actividades ilegales
  'hackear', 'phishing', 'estafa', 'robo', 'hurto', 'fraudulento',
  'piratería', 'contraseña', 'hack', 'crack',
  
  // Contenido peligroso para menores
  'menor', 'niño', 'pedofilia', 'abuso infantil',
  
  // Palabras en inglés comunes
  'kill', 'murder', 'suicide', 'bomb', 'weapon', 'hack', 'drug',
  'porn', 'nude', 'racist', 'terror', 'steal', 'fraud'
];

// Saludos y palabras comunes permitidas
const GREETINGS = [
  'hola', 'hello', 'buenos días', 'buenas tardes', 'buenas noches',
  'hi', 'hey', 'saludos', 'qué tal', 'cómo estás', 'adiós', 'bye',
  'gracias', 'thank you', 'por favor', 'please', 'ayuda', 'help'
];

// Patrones de código malicioso
const CODE_PATTERNS = [
  /<script[^>]*>.*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /eval\s*\(/gi,
  /document\.cookie/gi,
  /window\.location/gi,
  /fetch\s*\(/gi,
  /XMLHttpRequest/gi
];

// Temas educativos permitidos (para validación positiva)
const EDUCATIONAL_TOPICS = [
  // Matemáticas
  'matemáticas', 'matematica', 'álgebra', 'geometría', 'cálculo', 'estadística', 'probabilidad',
  'aritmética', 'trigonometría', 'funciones', 'ecuaciones', 'números', 'medidas',
  'matemáticas financieras', 'finanzas', 'interés', 'inversión', 'presupuesto', 'contabilidad',
  
  // Ciencias
  'ciencia', 'ciencias', 'biología', 'química', 'física', 'astronomía', 'geología',
  'ecología', 'genética', 'evolución', 'átomos', 'moléculas', 'energía',
  
  // Historia y estudios sociales
  'historia', 'geografía', 'política', 'economía', 'sociedad', 'cultura',
  'civilización', 'guerra', 'revolución', 'democracia', 'gobierno', 'ley',
  
  // Tecnología y programación
  'tecnología', 'informática', 'computación', 'programación', 'software', 'hardware',
  'internet', 'redes', 'base de datos', 'algoritmos', 'inteligencia artificial',
  'web', 'código', 'desarrollo', 'aplicaciones',
  
  // Artes y humanidades
  'arte', 'música', 'literatura', 'filosofía', 'psicología', 'sociología',
  'antropología', 'lingüística', 'idiomas', 'escritura', 'poesía',
  
  // Negocios y administración
  'negocios', 'empresa', 'marketing', 'ventas', 'administración', 'gestión',
  'estrategia', 'mercado', 'cliente', 'producto', 'servicio',
  
  // Salud y medicina
  'medicina', 'salud', 'enfermedad', 'tratamiento', 'diagnóstico', 'anatomía',
  'fisiología', 'nutrición', 'ejercicio', 'bienestar',
  
  // Educación general
  'educación', 'aprendizaje', 'enseñanza', 'escuela', 'universidad', 'estudio',
  'conocimiento', 'investigación', 'análisis', 'teoría', 'principio',
  
  // Ciencias ambientales
  'medio ambiente', 'clima', 'sostenibilidad', 'recursos', 'contaminación',
  'conservación', 'biodiversidad', 'ecosistema',
  
  // Ingeniería
  'ingeniería', 'construcción', 'diseño', 'estructura', 'materiales',
  'manufactura', 'producción', 'calidad', 'proceso'
];

class ContentFilter {
  static validateInput(input) {
    if (!input || typeof input !== 'string') {
      return { 
        isValid: false, 
        reason: 'Entrada inválida o vacía',
        isEducational: false
      };
    }

    const normalizedInput = input.toLowerCase().trim();
    
    // 1. Verificar longitud máxima
    if (normalizedInput.length > 500) {
      return { 
        isValid: false, 
        reason: 'El texto es demasiado largo (máximo 500 caracteres)',
        isEducational: false
      };
    }

    // 2. Detectar código malicioso
    for (const pattern of CODE_PATTERNS) {
      if (pattern.test(input)) {
        return { 
          isValid: false, 
          reason: 'Se detectó código potencialmente malicioso',
          isEducational: false
        };
      }
    }

    // 3. Verificar blacklist - solo bloquear contenido realmente dañino
    for (const word of BLACKLIST) {
      if (normalizedInput.includes(word.toLowerCase())) {
        return { 
          isValid: false, 
          reason: 'Contenido no apropiado',
          isEducational: false
        };
      }
    }

    // 4. Si pasa todas las validaciones, permitirlo
    return { 
      isValid: true, 
      reason: 'Contenido permitido',
      isEducational: false
    };
  }

  static getEducationalSuggestion() {
    const suggestions = [
      'matemáticas: álgebra, geometría, cálculo',
      'ciencias: biología, química, física',
      'historia: civilizaciones antiguas, revoluciones',
      'geografía: países, continentes, ecosistemas',
      'literatura: obras clásicas, autores famosos',
      'tecnología: programación, inteligencia artificial',
      'arte: pintura, música, escultura',
      'economía: mercados, empresas, finanzas'
    ];
    
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }

  static sanitizeForDisplay(input) {
    if (!input) return '';
    
    return input
      .replace(/<[^>]*>/g, '') // Eliminar HTML
      .replace(/javascript:/gi, '') // Eliminar protocolos JS
      .replace(/on\w+\s*=/gi, '') // Eliminar event handlers
      .trim();
  }
}

export default ContentFilter;
