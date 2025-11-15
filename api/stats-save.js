import Joi from 'joi';

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
}
