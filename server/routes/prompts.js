import express from 'express';

const router = express.Router();

// Endpoint para obtener plantillas de prompts predefinidos
router.get('/prompts/templates', (req, res) => {
  const templates = {
    quiz: {
      basic: "Genera preguntas básicas sobre {topic}",
      intermediate: "Crea preguntas de nivel intermedio sobre {topic}",
      advanced: "Desarrolla preguntas avanzadas sobre {topic}"
    },
    guide: {
      summary: "Crea un resumen completo sobre {topic}",
      detailed: "Genera una guía detallada sobre {topic}",
      practical: "Desarrolla ejemplos prácticos sobre {topic}"
    }
  };
  
  res.json({
    templates,
    usage: "Reemplaza {topic} con tu tema específico"
  });
});

export { router as promptsRoutes };

