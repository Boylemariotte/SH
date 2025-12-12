import { useState, useCallback } from 'react';

const MAX_TEXT_LENGTH = 8000; // Máximo caracteres para la API

// URL dinámica de la API
const getApiUrl = () => {
  // En producción (Vercel), usar rutas relativas
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || ''; // Rutas relativas: /api/endpoint
  }
  // En desarrollo, usar localhost con puerto 5000
  return 'http://localhost:5000';
};

// Obtener API key según el entorno
const getApiKey = () => {
  // En producción, no enviar API key (la maneja el servidor)
  if (import.meta.env.PROD) {
    return null;
  }
  // En desarrollo, enviar API key del frontend
  return import.meta.env.VITE_GROQ_API_KEY;
};

export const useFileProcessor = () => {
  const [processedText, setProcessedText] = useState('');
  const [originalFileName, setOriginalFileName] = useState('');
  const [extractedTopics, setExtractedTopics] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const preprocessText = useCallback((text) => {
    // Limpiar caracteres problemáticos
    let cleanedText = text
      .replace(/[^\w\s\.\,\;\:\!\?\-\n\ñ\Ñ]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Limitar longitud si es muy largo
    if (cleanedText.length > MAX_TEXT_LENGTH) {
      cleanedText = cleanedText.substring(0, MAX_TEXT_LENGTH) + '...';
    }

    return cleanedText;
  }, []);

  const extractTopics = useCallback((text) => {
    // Extraer palabras clave y temas principales
    const words = text
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 4);

    // Palabras comunes a ignorar
    const stopWords = new Set([
      'este', 'esta', 'estos', 'estas', 'aquel', 'aquella', 'aquello',
      'según', 'cuando', 'donde', 'como', 'entre', 'hacia', 'hasta',
      'puede', 'pueden', 'ser', 'estar', 'tener', 'haber', 'hacer',
      'general', 'importante', 'diferente', 'varios', 'todos', 'todas',
      'sobre', 'desde', 'contra', 'durante', 'mediante', 'excepto'
    ]);

    // Contar frecuencia de palabras
    const wordFrequency = {};
    words.forEach(word => {
      if (!stopWords.has(word)) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });

    // Obtener las palabras más frecuentes
    const topics = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));

    return topics;
  }, []);

  const processFile = useCallback(async (text, fileName) => {
    setIsProcessing(true);
    setError('');
    
    try {
      // Preprocesar el texto
      const cleanedText = preprocessText(text);
      
      if (cleanedText.length < 100) {
        throw new Error('El texto es demasiado corto para generar contenido significativo.');
      }

      // Extraer temas
      const topics = extractTopics(cleanedText);

      setProcessedText(cleanedText);
      setOriginalFileName(fileName);
      setExtractedTopics(topics);

      return {
        text: cleanedText,
        fileName,
        topics,
        originalLength: text.length,
        processedLength: cleanedText.length
      };

    } catch (err) {
      const errorMessage = err.message || 'Error al procesar el archivo';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [preprocessText, extractTopics]);

  const clearProcessedFile = useCallback(() => {
    setProcessedText('');
    setOriginalFileName('');
    setExtractedTopics([]);
    setError('');
  }, []);

  const generateQuizFromText = useCallback(async (text, difficulty, numQuestions, apiKey) => {
    const difficultyPrompts = {
      facil: 'Las preguntas deben ser básicas y para principiantes, con respuestas directas.',
      medio: 'Las preguntas deben ser de nivel intermedio, requiriendo comprensión del tema.',
      dificil: 'Las preguntas deben ser avanzadas y desafiantes, requiriendo conocimiento profundo.',
      experto: 'Las preguntas deben ser de nivel experto, con detalles técnicos y conceptos avanzados.'
    };

    const prompt = `Basado en el siguiente texto de estudio, genera exactamente ${numQuestions} preguntas de opción múltiple:

TEXTO DE ESTUDIO:
"""
${text}
"""

NIVEL DE DIFICULTAD: ${difficulty.toUpperCase()}
${difficultyPrompts[difficulty]}

INSTRUCCIONES IMPORTANTES:
- Las preguntas deben basarse ESPECÍFICAMENTE en el contenido del texto proporcionado
- No inventes información que no esté en el texto
- Las preguntas deben evaluar la comprensión de los conceptos clave del texto
- Las opciones incorrectas deben ser plausibles pero incorrectas según el texto

Responde ÚNICAMENTE con un array JSON válido, sin texto adicional antes o después.

Formato requerido:
[
  {
    "question": "Pregunta clara basada en el texto",
    "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
    "correct": 0
  }
]

El campo "correct" debe ser el índice (0-3) de la respuesta correcta según el texto.`;

    const response = await fetch(`${getApiUrl()}/api/generate-quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        ...(getApiKey() && { apiKey: getApiKey() }) // Solo en desarrollo
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Procesar respuesta de Groq (formato OpenAI)
    let content = '';
    if (data.choices && data.choices[0] && data.choices[0].message) {
      content = data.choices[0].message.content;
    } else if (Array.isArray(data) && data.length > 0) {
      content = data[0].generated_text || data[0];
    } else if (data.generated_text) {
      content = data.generated_text;
    } else if (typeof data === 'string') {
      content = data;
    }
    
    let cleanContent = content.trim();
    const jsonMatch = cleanContent.match(/\[[\s\S]*\]/);
    
    if (!jsonMatch) {
      throw new Error('La IA no generó el formato correcto. Intenta de nuevo.');
    }

    const parsedQuestions = JSON.parse(jsonMatch[0]);
    
    if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
      throw new Error('No se generaron preguntas válidas.');
    }

    const validQuestions = parsedQuestions.filter(q => 
      q.question && 
      Array.isArray(q.options) && 
      q.options.length === 4 && 
      typeof q.correct === 'number' && 
      q.correct >= 0 && 
      q.correct <= 3
    );

    if (validQuestions.length === 0) {
      throw new Error('Las preguntas generadas no tienen el formato correcto.');
    }

    return validQuestions.slice(0, numQuestions);

  }, []);

  const generateGuideFromText = useCallback(async (text, difficulty, apiKey) => {
    const difficultyPrompts = {
      facil: 'Explica los conceptos básicos de manera simple y directa, como si estuvieras enseñando a alguien que recién comienza a aprender sobre el tema. Incluye ejemplos sencillos y evita jerga técnica compleja sin explicación.',
      medio: 'Proporciona una explicación detallada del tema, asumiendo que la persona tiene un conocimiento básico. Incluye conceptos clave, ejemplos prácticos y aplicaciones del tema.',
      dificil: 'Ofrece un análisis en profundidad del tema, incluyendo conceptos avanzados, teorías y aplicaciones prácticas. Incluye ejemplos detallados y considera diferentes perspectivas o enfoques.',
      experto: 'Desarrolla una guía completa y detallada a nivel universitario o profesional. Incluye conceptos avanzados, investigación actual, estudios de caso y aplicaciones prácticas. No evites la terminología técnica, pero asegúrate de explicarla claramente.'
    };

    const prompt = `Basado en el siguiente texto, crea una guía de estudio detallada y estructurada:

TEXTO DE ESTUDIO:
"""
${text}
"""

NIVEL DE DIFICULTAD: ${difficulty.toUpperCase()}
${difficultyPrompts[difficulty]}

La guía debe estar basada exclusivamente en el contenido del texto proporcionado y debe incluir:
1. Una introducción al tema basada en el texto
2. Conceptos clave extraídos del texto
3. Ejemplos prácticos del texto
4. Aplicaciones mencionadas en el texto
5. Resumen de los puntos más importantes
6. Preguntas de repaso basadas en el texto

Formato de respuesta:
- Usa títulos en negrita para las secciones principales
- Usa viñetas para listas
- Incluye citas directas del texto cuando sea relevante
- Usa un lenguaje claro y estructurado
- La extensión debe ser de aproximadamente 1000-1500 palabras`;

    const response = await fetch(`${getApiUrl()}/api/generate-quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        ...(getApiKey() && { apiKey: getApiKey() }) // Solo en desarrollo
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    let content = '';
    if (data.choices && data.choices[0] && data.choices[0].message) {
      content = data.choices[0].message.content;
    } else if (Array.isArray(data) && data.length > 0) {
      content = data[0].generated_text || data[0];
    } else if (data.generated_text) {
      content = data.generated_text;
    } else if (typeof data === 'string') {
      content = data;
    }
    
    return {
      content: content.trim(),
      source: 'Archivo de texto',
      difficulty: difficulty,
      originalFileName: originalFileName,
      extractedTopics: extractedTopics
    };
    
  }, [originalFileName, extractedTopics]);

  return {
    processedText,
    originalFileName,
    extractedTopics,
    isProcessing,
    error,
    processFile,
    clearProcessedFile,
    generateQuizFromText,
    generateGuideFromText
  };
};
