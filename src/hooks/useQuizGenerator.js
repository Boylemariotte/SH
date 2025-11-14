import { useState, useCallback } from 'react';

const DIFFICULTY_PROMPTS = {
  facil: 'Las preguntas deben ser básicas y para principiantes, con respuestas directas.',
  medio: 'Las preguntas deben ser de nivel intermedio, requiriendo comprensión del tema.',
  dificil: 'Las preguntas deben ser avanzadas y desafiantes, requiriendo conocimiento profundo.',
  experto: 'Las preguntas deben ser de nivel experto, con detalles técnicos y conceptos avanzados.'
};

const API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY

export const useQuizGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateQuestion = (question) => {
    return (
      question.question &&
      Array.isArray(question.options) &&
      question.options.length === 4 &&
      typeof question.correct === 'number' &&
      question.correct >= 0 &&
      question.correct <= 3
    );
  };

  const generateQuiz = useCallback(async (topic, difficulty, numQuestions) => {
    if (!API_KEY) {
      throw new Error('API Key no configurada. Por favor, configura VITE_HUGGINGFACE_API_KEY en tu archivo .env');
    }

    setIsLoading(true);
    setError('');

    try {
      const prompt = `Genera exactamente ${numQuestions} preguntas de opción múltiple sobre el tema: "${topic}".

NIVEL DE DIFICULTAD: ${difficulty.toUpperCase()}
${DIFFICULTY_PROMPTS[difficulty]}

Responde ÚNICAMENTE con un array JSON válido, sin texto adicional antes o después.

Formato requerido:
[
  {
    "question": "Pregunta clara y específica sobre el tema",
    "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
    "correct": 0
  }
]

El campo "correct" debe ser el índice (0-3) de la respuesta correcta.
Asegúrate de que las preguntas sean educativas, las opciones sean plausibles y en español.
IMPORTANTE: Las opciones incorrectas deben ser convincentes y relacionadas con el tema.`;

      const response = await fetch('/api/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 3000,
            temperature: 0.7,
            return_full_text: false
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Error al conectar con la IA. Verifica tu API key.');
      }

      const data = await response.json();
      
      // Hugging Face returns an array with generated_text
      const content = Array.isArray(data) ? data[0].generated_text : data.generated_text || '';
      
      // Extract JSON from response
      let cleanContent = content.trim();
      const jsonMatch = cleanContent.match(/\[[\s\S]*\]/);
      
      if (!jsonMatch) {
        throw new Error('La IA no generó el formato correcto. Intenta de nuevo.');
      }

      const parsedQuestions = JSON.parse(jsonMatch[0]);
      
      if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
        throw new Error('No se generaron preguntas válidas.');
      }

      // Validate questions
      const validQuestions = parsedQuestions.filter(validateQuestion);

      if (validQuestions.length === 0) {
        throw new Error('Las preguntas generadas no tienen el formato correcto.');
      }

      return validQuestions.slice(0, numQuestions);
      
    } catch (err) {
      const errorMessage = err.message || 'Error al generar el quiz. Intenta de nuevo.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { generateQuiz, isLoading, error, setError };
};
