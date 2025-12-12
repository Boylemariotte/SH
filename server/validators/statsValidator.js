import Joi from 'joi';

// Esquema de validación para guardar estadísticas
export const statsSchema = Joi.object({
  userStats: Joi.object().required(),
  quizHistory: Joi.array().required(),
  pointsData: Joi.object().required()
});

