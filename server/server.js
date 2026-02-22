import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import { quizRoutes } from './routes/quizGenerator.js';
import quizzesRoutes from './routes/quizManager.js';
import { healthRoutes } from './routes/health.js';
import statsNewRoutes from './routes/stats.js';
import guidesRoutes from './routes/guides.js';
import { promptsRoutes } from './routes/prompts.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';

dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

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

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', quizRoutes); // Rutas existentes de quiz (generación con IA)
app.use('/api/quizzes', quizzesRoutes); // Nuevas rutas CRUD de quizzes
app.use('/api', healthRoutes);
app.use('/api/stats', statsNewRoutes); // Rutas de estadísticas del usuario
app.use('/api/guides', guidesRoutes); // Rutas de guías de estudio
app.use('/api', promptsRoutes);

// Error handlers (deben ir al final)
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Enhanced server running on http://localhost:${PORT}`);
  console.log(`📊 Rate limiting: 20 requests per minute`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📈 Rate limit status: http://localhost:${PORT}/api/rate-limit`);
});

