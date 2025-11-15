import fetch from 'node-fetch';
import rateLimit from 'express-rate-limit';
import Joi from 'joi';

// Rate limiting para Vercel (en memoria, funciona para serverless)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: {
    error: 'Too many requests. Please try again later.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Esquema de validación
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

export default async function handler(req, res) {
  // Configurar CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    
    // Validar contenido sospechoso
    const suspiciousPatterns = [/<script/i, /javascript:/i, /eval\(/i];
    const hasSuspiciousContent = suspiciousPatterns.some(pattern => pattern.test(prompt));
    
    if (hasSuspiciousContent) {
      return res.status(400).json({ 
        error: 'Invalid content detected in prompt' 
      });
    }

    // Llamar a la API de Groq con timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    
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
    
    res.json(data);
    
  } catch (error) {
    console.error('Error:', error.message);
    
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
}
