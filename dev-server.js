import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Importar serverless functions dinámicamente
const apiFunctions = {
  'generate-quiz': './api/generate-quiz.js',
  'health': './api/health.js',
  'stats-save': './api/stats-save.js',
  'prompts-templates': './api/prompts-templates.js',
  'rate-limit': './api/rate-limit.js'
};

// Registrar rutas API
for (const [route, filePath] of Object.entries(apiFunctions)) {
  try {
    const module = await import(filePath);
    app.all(`/api/${route}`, async (req, res) => {
      try {
        await module.default(req, res);
      } catch (error) {
        console.error(`Error in ${route}:`, error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
    console.log(`✅ API route /api/${route} registered`);
  } catch (error) {
    console.error(`❌ Failed to load ${route}:`, error.message);
  }
}

// Servir archivos estáticos del frontend (opcional)
app.use(express.static(join(__dirname, 'dist')));

app.listen(PORT, () => {
  console.log(`🚀 Dev server (Vercel mode) running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available:`);
  Object.keys(apiFunctions).forEach(route => {
    console.log(`   http://localhost:${PORT}/api/${route}`);
  });
});
