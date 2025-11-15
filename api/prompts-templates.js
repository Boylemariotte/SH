export default function handler(req, res) {
  // Configurar CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
