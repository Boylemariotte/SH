// Middleware de filtrado de contenido para el servidor
import ContentFilter from '../../src/utils/contentFilter.js';

const contentFilterMiddleware = (req, res, next) => {
  try {
    // Solo filtrar requests que contienen prompts
    if (req.body && req.body.prompt) {
      const validation = ContentFilter.validateInput(req.body.prompt);
      
      if (!validation.isValid) {
        return res.status(400).json({
          error: 'CONTENIDO_BLOQUEADO',
          message: validation.reason,
          suggestion: ContentFilter.getEducationalSuggestion(),
          isEducational: validation.isEducational
        });
      }
    }
    
    next();
  } catch (error) {
    console.error('Error en content filter middleware:', error);
    res.status(500).json({
      error: 'ERROR_FILTRO',
      message: 'Error al validar el contenido'
    });
  }
};

export default contentFilterMiddleware;
