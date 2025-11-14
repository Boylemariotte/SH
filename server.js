import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import rateLimit from 'express-rate-limit';
import Joi from 'joi';

const app = express();
const PORT = 3001;

// Rate limiting: máximo 20 peticiones por minuto
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 20, // máximo 20 peticiones
  message: {
    error: 'Too many requests. Please try again later.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Esquema de validación para la petición
const quizRequestSchema = Joi.object({
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

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(limiter);

app.post('/api/generate-quiz', async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Validar la petición
    const { error, value } = quizRequestSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.details[0].message 
      });
    }
    
    const { prompt, apiKey } = value;
    
    // Log de la petición (sin mostrar la API key completa)
    console.log(`[${new Date().toISOString()}] Quiz request received - Prompt length: ${prompt.length}`);
    
    // Validar que el prompt no contenga contenido malicioso básico
    const suspiciousPatterns = [/<script/i, /javascript:/i, /eval\(/i];
    const hasSuspiciousContent = suspiciousPatterns.some(pattern => pattern.test(prompt));
    
    if (hasSuspiciousContent) {
      return res.status(400).json({ 
        error: 'Invalid content detected in prompt' 
      });
    }

    // Llamar a la API de Groq con timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 segundos timeout
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{
          role: "user",
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 3000
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    const data = await response.json();
    
    if (!response.ok) {
      console.error('API Error:', data);
      return res.status(response.status).json({
        error: data.error?.message || data.message || `Error ${response.status}`,
        type: 'api_error'
      });
    }

    // Log de éxito
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] Quiz generated successfully - Duration: ${duration}ms`);
    
    res.json(data);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[${new Date().toISOString()}] Error after ${duration}ms:`, error.message);
    
    if (error.name === 'AbortError') {
      return res.status(408).json({ 
        error: 'Request timeout. Please try again.',
        type: 'timeout_error'
      });
    }
    
    res.status(500).json({ 
      error: error.message,
      type: 'server_error'
    });
  }
});

// Endpoint de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Endpoint para verificar límites de rate limiting
app.get('/api/rate-limit', (req, res) => {
  res.json({
    limit: '20 requests per minute',
    window: '1 minute',
    remaining: req.rateLimit?.remaining || 'unknown'
  });
});

// Endpoint para guardar estadísticas (opcional, para persistencia futura)
app.post('/api/stats/save', async (req, res) => {
  try {
    const statsSchema = Joi.object({
      userStats: Joi.object().required(),
      quizHistory: Joi.array().required(),
      pointsData: Joi.object().required()
    });

    const { error, value } = statsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Invalid stats data', 
        details: error.details[0].message 
      });
    }

    // Por ahora solo logueamos los datos
    // En el futuro se guardarían en base de datos
    console.log(`[${new Date().toISOString()}] Stats saved for user`);
    
    res.json({ 
      success: true, 
      message: 'Stats logged successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error saving stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para obtener plantillas de prompts predefinidos
app.get('/api/prompts/templates', (req, res) => {
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

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
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
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: 'Internal server error',
    type: 'global_error',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Enhanced server running on http://localhost:${PORT}`);
  console.log(`📊 Rate limiting: 20 requests per minute`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📈 Rate limit status: http://localhost:${PORT}/api/rate-limit`);
});
