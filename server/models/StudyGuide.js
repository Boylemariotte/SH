import mongoose from 'mongoose';

const studyGuideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  topic: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  difficulty: {
    type: String,
    enum: ['facil', 'medio', 'dificil', 'experto'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  
  // Metadatos
  source: {
    type: String,
    enum: ['ai', 'file'],
    default: 'ai'
  },
  sourceFile: { type: String },
  
  // Estadísticas
  views: { type: Number, default: 0 },
  lastViewed: { type: Date },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

studyGuideSchema.index({ user: 1, createdAt: -1 });
studyGuideSchema.index({ topic: 'text' });

export default mongoose.model('StudyGuide', studyGuideSchema);

