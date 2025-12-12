import express from 'express';

const router = express.Router();

// Endpoint de salud del servidor
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Endpoint para verificar límites de rate limiting
router.get('/rate-limit', (req, res) => {
  res.json({
    limit: '20 requests per minute',
    window: '1 minute',
    remaining: req.rateLimit?.remaining || 'unknown'
  });
});

export { router as healthRoutes };

