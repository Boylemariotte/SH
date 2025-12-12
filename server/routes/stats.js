import express from 'express';
import { statsSchema } from '../validators/statsValidator.js';

const router = express.Router();

// Endpoint para guardar estadísticas (opcional, para persistencia futura)
router.post('/stats/save', async (req, res) => {
  try {
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

export { router as statsRoutes };

