import StudyGuide from '../models/StudyGuide.js';
import User from '../models/User.js';

// @desc    Crear una guía de estudio
// @route   POST /api/guides
// @access  Private
export const createStudyGuide = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, difficulty, content, source, sourceFile } = req.body;

    const guide = await StudyGuide.create({
      user: userId,
      topic,
      difficulty,
      content,
      source: source || 'ai',
      sourceFile: sourceFile || null
    });

    // Agregar a la lista de guías del usuario (desnormalización)
    const user = await User.findById(userId);
    if (user) {
      user.studyGuides.unshift({
        guideId: guide._id,
        topic,
        difficulty,
        createdAt: new Date(),
        lastViewed: new Date()
      });

      // Mantener solo las últimas 50 guías
      if (user.studyGuides.length > 50) {
        user.studyGuides = user.studyGuides.slice(0, 50);
      }

      await user.save();
    }

    res.status(201).json(guide);
  } catch (error) {
    console.error('Error creating study guide:', error);
    res.status(500).json({ message: 'Error al crear la guía', error: error.message });
  }
};

// @desc    Obtener guías del usuario
// @route   GET /api/guides
// @access  Private
export const getMyStudyGuides = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;

    // Obtener desde la colección (datos completos)
    const guides = await StudyGuide.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    // Obtener lista desnormalizada del usuario
    const user = await User.findById(userId).select('studyGuides');
    
    const total = await StudyGuide.countDocuments({ user: userId });

    res.json({
      guides,
      recentGuides: user.studyGuides || [],
      total,
      limit,
      skip
    });
  } catch (error) {
    console.error('Error getting study guides:', error);
    res.status(500).json({ message: 'Error al obtener las guías', error: error.message });
  }
};

// @desc    Obtener una guía específica
// @route   GET /api/guides/:id
// @access  Private
export const getStudyGuide = async (req, res) => {
  try {
    const userId = req.user._id;
    const guideId = req.params.id;

    const guide = await StudyGuide.findOne({ _id: guideId, user: userId });

    if (!guide) {
      return res.status(404).json({ message: 'Guía no encontrada' });
    }

    // Actualizar estadísticas de visualización
    guide.views += 1;
    guide.lastViewed = new Date();
    await guide.save();

    // Actualizar en la lista desnormalizada del usuario
    const user = await User.findById(userId);
    if (user) {
      const guideIndex = user.studyGuides.findIndex(
        g => g.guideId && g.guideId.toString() === guideId
      );
      if (guideIndex !== -1) {
        user.studyGuides[guideIndex].lastViewed = new Date();
        await user.save();
      }
    }

    res.json(guide);
  } catch (error) {
    console.error('Error getting study guide:', error);
    res.status(500).json({ message: 'Error al obtener la guía', error: error.message });
  }
};

// @desc    Buscar guías por tema
// @route   GET /api/guides/search
// @access  Private
export const searchStudyGuides = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, difficulty } = req.query;
    const query = { user: userId };

    if (topic) {
      query.topic = { $regex: topic, $options: 'i' };
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }

    const guides = await StudyGuide.find(query)
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(guides);
  } catch (error) {
    console.error('Error searching study guides:', error);
    res.status(500).json({ message: 'Error al buscar guías', error: error.message });
  }
};

// @desc    Eliminar una guía
// @route   DELETE /api/guides/:id
// @access  Private
export const deleteStudyGuide = async (req, res) => {
  try {
    const userId = req.user._id;
    const guideId = req.params.id;

    const guide = await StudyGuide.findOneAndDelete({ _id: guideId, user: userId });

    if (!guide) {
      return res.status(404).json({ message: 'Guía no encontrada' });
    }

    // Eliminar de la lista desnormalizada del usuario
    const user = await User.findById(userId);
    if (user) {
      user.studyGuides = user.studyGuides.filter(
        g => !g.guideId || g.guideId.toString() !== guideId
      );
      await user.save();
    }

    res.json({ message: 'Guía eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting study guide:', error);
    res.status(500).json({ message: 'Error al eliminar la guía', error: error.message });
  }
};

