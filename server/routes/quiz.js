import express from 'express';
import fetch from 'node-fetch';
import { quizRequestSchema } from '../validators/quizValidator.js';
import { validateContent } from '../middleware/contentValidator.js';

const router = express.Router();

router.post('/generate-quiz', async (req, res) => {
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
    
    // Validar contenido sospechoso
    if (!validateContent(prompt)) {
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

export { router as quizRoutes };

