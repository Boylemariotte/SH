import Joi from 'joi';

// Esquema de validación para la petición de quiz
export const quizRequestSchema = Joi.object({
  prompt: Joi.string().required().min(10).max(10000).messages({
    'string.empty': 'El prompt es requerido',
    'string.min': 'El prompt debe tener al menos 10 caracteres',
    'string.max': 'El prompt no puede exceder 10000 caracteres',
    'any.required': 'El prompt es requerido'
  }),
  apiKey: Joi.string().required().pattern(/^gsk_/).messages({
    'string.empty': 'La API key es requerida',
    'string.pattern.base': 'La API key debe empezar con "gsk_"',
    'any.required': 'La API key es requerida'
  })
});

