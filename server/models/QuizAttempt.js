import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
    index: true
  },
  
  // Datos del quiz al momento del intento (snapshot)
  topic: { type: String, required: true },
  difficulty: { type: String, required: true },
  numQuestions: { type: Number, required: true },
  
  // Respuestas del usuario
  answers: [{
    questionIndex: { type: Number, required: true },
    question: { type: String, required: true },
    userAnswer: { type: Number, required: true },
    correctAnswer: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true },
    timeSpent: { type: Number, default: 0 }
  }],
  
  // Resultados
  score: { type: Number, required: true, min: 0, max: 100 },
  correctAnswers: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  pointsEarned: { type: Number, default: 0 },
  
  // Metadatos del intento
  livesRemaining: { type: Number, default: 3 },
  streak: { type: Number, default: 0 },
  completedAt: { type: Date, default: Date.now },
  duration: { type: Number, default: 0 }, // Duración total en segundos
  
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

quizAttemptSchema.index({ user: 1, createdAt: -1 });
quizAttemptSchema.index({ quiz: 1, score: -1 });
quizAttemptSchema.index({ topic: 1, difficulty: 1 });

export default mongoose.model('QuizAttempt', quizAttemptSchema);

