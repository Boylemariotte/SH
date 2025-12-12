// Manejo de rutas no encontradas
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    availableEndpoints: [
      'POST /api/generate-quiz - Generate quiz with AI',
      'GET /api/health - Server health check',
      'GET /api/rate-limit - Check rate limiting status',
      'POST /api/stats/save - Save user statistics (future DB)',
      'GET /api/prompts/templates - Get prompt templates'
    ]
  });
};

