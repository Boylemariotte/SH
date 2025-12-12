import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: [true, 'El tema es obligatorio'],
    trim: true,
    index: true
  },
  difficulty: {
    type: String,
    enum: ['facil', 'medio', 'dificil', 'experto'],
    required: true,
    index: true
  },
  numQuestions: {
    type: Number,
    required: true,
    min: 3,
    max: 20
  },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }], // Array de 4 opciones
    correct: { type: Number, required: true, min: 0, max: 3 },
    explanation: { type: String } // Opcional: explicación de la respuesta
  }],
  
  // Metadatos
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  source: {
    type: String,
    enum: ['ai', 'file', 'manual'],
    default: 'ai'
  },
  sourceFile: { type: String },
  
  // Estadísticas de uso
  timesUsed: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

quizSchema.index({ topic: 'text' }); // Búsqueda por texto
quizSchema.index({ difficulty: 1, topic: 1 });
quizSchema.index({ createdAt: -1 });
quizSchema.index({ createdBy: 1 });

export default mongoose.model('Quiz', quizSchema);

