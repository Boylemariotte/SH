import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import { generateQuiz } from './groq.js';
import connectDB from './database.js';
import contentFilterMiddleware from './middleware/contentFilter.js';

// Configuración
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3001;

// Conectar a la base de datos
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
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

app.use('/api/', limiter);

// Servir archivos estáticos del frontend
app.use(express.static(join(__dirname, '../dist')));

// API Routes
app.post('/api/generate-quiz', contentFilterMiddleware, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const result = await generateQuiz(prompt, config.groqApiKey);
    
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] Quiz generated successfully - Duration: ${duration}ms`);
    
    res.json(result);
    
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ 
      error: 'Failed to generate quiz',
      message: error.message 
    });
  }
});

// Ruta catch-all para servir el frontend (SPA)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB Connected: ${config.mongoUri}`);
});
