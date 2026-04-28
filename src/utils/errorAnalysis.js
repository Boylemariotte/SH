// utils/errorAnalysis.js
export const analyzeErrorPatterns = (questions, incorrectAnswers) => {
  const patterns = [];
  const specificErrors = [];
  const conceptsToReview = [];
  
  incorrectAnswers.forEach(incorrect => {
    const question = questions[incorrect.questionIndex];
    const wrongOption = question.options[incorrect.answer];
    const correctOption = question.options[question.correct];
    
    // Extraer conceptos específicos de la pregunta
    const questionText = question.question.toLowerCase();
    const wrongOptionText = wrongOption.toLowerCase();
    const correctOptionText = correctOption.toLowerCase();
    
    // Análisis detallado por tipo de pregunta y contenido
    if (question.question.includes('¿Qué es') || question.question.includes('¿Qué son')) {
      patterns.push('Dificultad en preguntas de definición');
      
      // Extraer el concepto específico que se está definiendo
      const conceptMatch = question.question.match(/¿Qué (?:es|son)\s+([^?]+)/i);
      if (conceptMatch) {
        const concept = conceptMatch[1].trim();
        specificErrors.push(`No definiste correctamente: "${concept}"`);
        conceptsToReview.push(`Definición de ${concept}`);
      }
    }
    
    if (question.question.includes('¿Cuál es') || question.question.includes('¿Cuáles son')) {
      patterns.push('Problemas con preguntas de identificación');
      
      // Extraer qué se está identificando
      const conceptMatch = question.question.match(/¿Cuál (?:es|son)\s+([^?]+)/i);
      if (conceptMatch) {
        const concept = conceptMatch[1].trim();
        specificErrors.push(`No identificaste correctamente: "${concept}"`);
        conceptsToReview.push(`Identificación de ${concept}`);
      }
    }
    
    if (question.question.includes('¿Cómo') || question.question.includes('cómo')) {
      patterns.push('Necesita reforzar procesos y procedimientos');
      
      // Extraer el proceso
      const processMatch = question.question.match(/¿Cómo\s+([^?]+)/i);
      if (processMatch) {
        const process = processMatch[1].trim();
        specificErrors.push(`No explicaste correctamente el proceso: "${process}"`);
        conceptsToReview.push(`Proceso de ${process}`);
      }
    }
    
    if (question.question.includes('¿Por qué') || question.question.includes('por qué')) {
      patterns.push('Dificultad con conceptos de causa y efecto');
      
      // Extraer la causa
      const causeMatch = question.question.match(/¿Por qué\s+([^?]+)/i);
      if (causeMatch) {
        const cause = causeMatch[1].trim();
        specificErrors.push(`No explicaste correctamente la causa: "${cause}"`);
        conceptsToReview.push(`Causa de ${cause}`);
      }
    }
    
    // Análisis de opciones incorrectas seleccionadas
    if (wrongOption.includes('siempre') || wrongOption.includes('nunca')) {
      patterns.push('Tendencia a generalizaciones absolutas');
      specificErrors.push(`Seleccionaste una generalización absoluta: "${wrongOption}"`);
      conceptsToReview.push('Evitar generalizaciones absolutas');
    }
    
    if (wrongOption.includes('todos') || wrongOption.includes('ninguno')) {
      patterns.push('Problemas con opciones extremas');
      specificErrors.push(`Seleccionaste una opción extrema: "${wrongOption}"`);
      conceptsToReview.push('Considerar matices y excepciones');
    }
    
    // Análisis por temas específicos con conceptos detallados
    if (questionText.includes('matemática') || questionText.includes('cálculo') || questionText.includes('número')) {
      patterns.push('Necesita reforzar conceptos matemáticos');
      
      // Extraer conceptos matemáticos específicos
      if (questionText.includes('ecuación')) {
        specificErrors.push('Error en resolución de ecuaciones');
        conceptsToReview.push('Resolución de ecuaciones');
      } else if (questionText.includes('derivada')) {
        specificErrors.push('Error en conceptos de cálculo diferencial');
        conceptsToReview.push('Derivadas y sus aplicaciones');
      } else if (questionText.includes('integral')) {
        specificErrors.push('Error en conceptos de cálculo integral');
        conceptsToReview.push('Integrales y sus aplicaciones');
      } else {
        specificErrors.push('Error en concepto matemático básico');
        conceptsToReview.push('Fundamentos matemáticos');
      }
    }
    
    if (questionText.includes('historia') || questionText.includes('fecha') || questionText.includes('año')) {
      patterns.push('Dificultad con datos históricos y cronología');
      
      // Extraer períodos o eventos históricos
      const historyMatch = questionText.match(/(\d{4}|siglo \w+|edad \w+|reinado|guerra|revolución)/i);
      if (historyMatch) {
        const period = historyMatch[1];
        specificErrors.push(`Error en período histórico: ${period}`);
        conceptsToReview.push(`Período: ${period}`);
      } else {
        specificErrors.push('Error en dato histórico o cronológico');
        conceptsToReview.push('Cronología histórica');
      }
    }
    
    if (questionText.includes('ciencia') || questionText.includes('experimento') || questionText.includes('fórmula')) {
      patterns.push('Necesita mejorar en conceptos científicos');
      
      // Extraer conceptos científicos específicos
      if (questionText.includes('átomo') || questionText.includes('molécula')) {
        specificErrors.push('Error en conceptos de química atómica');
        conceptsToReview.push('Estructura atómica y molecular');
      } else if (questionText.includes('célula')) {
        specificErrors.push('Error en conceptos de biología celular');
        conceptsToReview.push('Biología celular');
      } else if (questionText.includes('fuerza') || questionText.includes('energía')) {
        specificErrors.push('Error en conceptos de física');
        conceptsToReview.push('Fuerza y energía');
      } else {
        specificErrors.push('Error en concepto científico general');
        conceptsToReview.push('Método científico');
      }
    }
    
    if (questionText.includes('geografía') || questionText.includes('país') || questionText.includes('capital')) {
      patterns.push('Problemas con conocimiento geográfico');
      
      // Extraer ubicaciones geográficas
      const geoMatch = questionText.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g);
      if (geoMatch) {
        const locations = geoMatch.slice(0, 2); // Tomar máximo 2 ubicaciones
        specificErrors.push(`Error en ubicación geográfica: ${locations.join(', ')}`);
        conceptsToReview.push(`Geografía de: ${locations.join(', ')}`);
      } else {
        specificErrors.push('Error en conocimiento geográfico');
        conceptsToReview.push('Geografía general');
      }
    }
    
    // Análisis comparativo entre respuesta incorrecta y correcta
    if (wrongOptionText.includes('no') && !correctOptionText.includes('no')) {
      specificErrors.push('Confundiste una afirmación negativa con una positiva');
      conceptsToReview.push('Atención a detalles negativos');
    }
    
    if (wrongOptionText.includes('aumento') && correctOptionText.includes('disminución')) {
      specificErrors.push('Confundiste tendencia opuesta (aumento vs disminución)');
      conceptsToReview.push('Dirección de tendencias');
    }
    
    if (wrongOptionText.includes('mayor') && correctOptionText.includes('menor')) {
      specificErrors.push('Invertiste la relación de magnitud');
      conceptsToReview.push('Comparaciones y magnitudes');
    }
  });
  
  return {
    patterns: [...new Set(patterns)],
    specificErrors: [...new Set(specificErrors)],
    conceptsToReview: [...new Set(conceptsToReview)]
  };
};

export const generatePersonalizedFeedback = async (questions, userAnswers, topic, difficulty) => {
  const incorrectAnswers = userAnswers.filter(a => !a.correct);
  const correctAnswers = userAnswers.filter(a => a.correct);
  const percentage = Math.round((correctAnswers.length / questions.length) * 100);
  
  // Análisis detallado de errores
  const errorAnalysis = analyzeErrorPatterns(questions, incorrectAnswers);
  
  // Generar prompt para IA con información específica
  const feedbackPrompt = `
    Analiza el rendimiento de un estudiante en un quiz sobre "${topic}" (dificultad: ${difficulty}).
    
    Resultados:
    - Correctas: ${correctAnswers.length}/${questions.length} (${percentage}%)
    - Incorrectas: ${incorrectAnswers.length}
    
    Errores específicos detectados:
    ${errorAnalysis.specificErrors.map(error => `- ${error}`).join('\n')}
    
    Patrones de error identificados:
    ${errorAnalysis.patterns.map(pattern => `- ${pattern}`).join('\n')}
    
    Conceptos específicos que necesita revisar:
    ${errorAnalysis.conceptsToReview.map(concept => `- ${concept}`).join('\n')}
    
    Genera retroalimentación personalizada en formato JSON que incluya:
    1. strengths: Array de 2-3 fortalezas detectadas (si hay)
    2. specificErrors: Array de errores específicos cometidos (usar la información proporcionada)
    3. conceptsToReview: Array de conceptos específicos que debe estudiar
    4. recommendations: Array de 3-4 recomendaciones PRECISAS con:
       - title: Título corto específico
       - description: Descripción detallada del concepto a estudiar
       - action: Acción específica relacionada con el concepto
       - priority: "alta" o "media" según la importancia
    5. motivation: Frase motivacional personalizada
    
    IMPORTANTE: Las recomendaciones deben ser ESPECÍFICAS, no genéricas. En lugar de "estudia más", di "estudia los conceptos de X que fallaste".
    
    Formato exacto: {"strengths": [...], "specificErrors": [...], "conceptsToReview": [...], "recommendations": [...], "motivation": "..."}
  `;
  
  try {
    // Usar fetch nativo del navegador
    const response = await fetch('/api/generate-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: feedbackPrompt
      })
    });
    
    if (!response.ok) {
      throw new Error('Error generating feedback');
    }
    
    const data = await response.json();
    return JSON.parse(data.feedback);
    
  } catch (error) {
    console.error('Error generating AI feedback:', error);
    
    // Fallback a feedback específico pero útil
    return generateSpecificFallbackFeedback(percentage, errorAnalysis, topic);
  }
};

const generateSpecificFallbackFeedback = (percentage, errorAnalysis, topic) => {
  const strengths = [];
  const specificErrors = errorAnalysis.specificErrors;
  const conceptsToReview = errorAnalysis.conceptsToReview;
  
  if (percentage >= 80) {
    strengths.push('Excelente comprensión general del tema');
    strengths.push('Base sólida para avanzar');
  } else if (percentage >= 60) {
    strengths.push('Comprensión básica del tema');
    strengths.push('Buen potencial de mejora');
  } else {
    strengths.push('Interés en aprender sobre el tema');
    strengths.push('Esfuerzo por intentarlo');
  }
  
  // Recomendaciones específicas basadas en los conceptos a revisar
  const recommendations = conceptsToReview.map((concept, index) => ({
    title: `Repasar: ${concept}`,
    description: `Necesitas reforzar específicamente el concepto de ${concept}. Esta fue un área donde tuviste dificultades.`,
    action: 'Practicar preguntas sobre este concepto',
    priority: index === 0 ? 'alta' : 'media'
  }));
  
  // Agregar recomendaciones generales si hay pocas específicas
  if (recommendations.length < 2) {
    recommendations.push({
      title: 'Práctica Enfocada',
      description: 'Concentrarte en los tipos de preguntas donde cometiste errores',
      action: 'Repetir quiz con mismo tema',
      priority: 'media'
    });
    
    recommendations.push({
      title: 'Guía Personalizada',
      description: 'Crear una guía de estudio para los conceptos que necesitas reforzar',
      action: 'Generar guía de estudio',
      priority: 'media'
    });
  }
  
  const motivation = percentage >= 80 
    ? '¡Excelente trabajo! Sigue así y alcanzarás la maestría.'
    : percentage >= 60
    ? '¡Vas por buen camino! Enfócate en los conceptos específicos y mejorarás.'
    : '¡No te desanimes! Cada error específico que identificaste es una oportunidad para mejorar.';
  
  return {
    strengths,
    specificErrors,
    conceptsToReview,
    recommendations,
    motivation
  };
};
