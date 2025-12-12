import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import rateLimit from 'express-rate-limit';
import { quizRoutes } from './routes/quiz.js';
import { healthRoutes } from './routes/health.js';
import { statsRoutes } from './routes/stats.js';
import { promptsRoutes } from './routes/prompts.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';

const app = express();
const PORT = process.env.PORT || 3001;

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
app.use('/api', quizRoutes);
app.use('/api', healthRoutes);
app.use('/api', statsRoutes);
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

