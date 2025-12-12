import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es obligatorio'],
    unique: true,
    trim: true,
    minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres'],
    maxlength: [30, 'El nombre de usuario no puede exceder 30 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor ingresa un email válido'
    ]
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  
  // Estadísticas desnormalizadas (calculadas y almacenadas)
  stats: {
    totalPoints: { type: Number, default: 0 },
    totalQuizzes: { type: Number, default: 0 },
    totalCorrectAnswers: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    dailyStreak: { type: Number, default: 0 },
    lastQuizDate: { type: Date, default: null },
    bestScore: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    accuracyPercentage: { type: Number, default: 0 }
  },
  
  // Preferencias del usuario
  preferences: {
    defaultDifficulty: { type: String, enum: ['facil', 'medio', 'dificil', 'experto'], default: 'medio' },
    defaultNumQuestions: { type: Number, default: 5, min: 3, max: 20 },
    theme: { type: String, default: 'light' }
  },
  
  // Quizzes realizados (desnormalizados - últimos N quizzes)
  recentQuizzes: [{
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    topic: String,
    difficulty: String,
    score: Number,
    correctAnswers: Number,
    totalQuestions: Number,
    pointsEarned: Number,
    completedAt: { type: Date, default: Date.now }
  }],
  
  // Historial de puntos (desnormalizado - últimos N)
  recentPointsHistory: [{
    points: Number,
    source: { type: String, enum: ['quiz', 'bonus', 'achievement'], default: 'quiz' },
    topic: String,
    difficulty: String,
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Guías de estudio guardadas (desnormalizadas)
  studyGuides: [{
    guideId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudyGuide' },
    topic: String,
    difficulty: String,
    createdAt: { type: Date, default: Date.now },
    lastViewed: { type: Date }
  }],
  
  // Metadatos
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Índices para mejorar rendimiento
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'stats.totalPoints': -1 }); // Para rankings

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    this.updatedAt = Date.now();
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.updatedAt = Date.now();
});

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Método para actualizar estadísticas
userSchema.methods.updateStats = function(quizData) {
  const { correctAnswers, totalQuestions, score, pointsEarned } = quizData;
  
  this.stats.totalQuizzes += 1;
  this.stats.totalCorrectAnswers += correctAnswers;
  this.stats.totalQuestions += totalQuestions;
  this.stats.totalPoints += pointsEarned || 0;
  
  // Actualizar mejor puntaje
  if (score > this.stats.bestScore) {
    this.stats.bestScore = score;
  }
  
  // Calcular promedio
  this.stats.averageScore = Math.round(
    (this.stats.totalCorrectAnswers / this.stats.totalQuestions) * 100
  );
  this.stats.accuracyPercentage = this.stats.averageScore;
  
  // Actualizar racha diaria
  const today = new Date().toDateString();
  const lastDate = this.stats.lastQuizDate ? new Date(this.stats.lastQuizDate).toDateString() : null;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();
  
  if (lastDate !== today) {
    if (lastDate === yesterdayStr || lastDate === null) {
      this.stats.dailyStreak += 1;
    } else {
      this.stats.dailyStreak = 1;
    }
    this.stats.lastQuizDate = new Date();
  }
};

// Método para agregar quiz reciente (mantiene máximo 50)
userSchema.methods.addRecentQuiz = function(quizData) {
  this.recentQuizzes.unshift({
    quizId: quizData.quizId,
    topic: quizData.topic,
    difficulty: quizData.difficulty,
    score: quizData.score,
    correctAnswers: quizData.correctAnswers,
    totalQuestions: quizData.totalQuestions,
    pointsEarned: quizData.pointsEarned,
    completedAt: new Date()
  });
  
  // Mantener solo los últimos 50
  if (this.recentQuizzes.length > 50) {
    this.recentQuizzes = this.recentQuizzes.slice(0, 50);
  }
};

// Método para agregar puntos al historial (mantiene máximo 100)
userSchema.methods.addPointsHistory = function(pointsData) {
  this.recentPointsHistory.unshift({
    points: pointsData.points,
    source: pointsData.source || 'quiz',
    topic: pointsData.topic,
    difficulty: pointsData.difficulty,
    createdAt: new Date()
  });
  
  // Mantener solo los últimos 100
  if (this.recentPointsHistory.length > 100) {
    this.recentPointsHistory = this.recentPointsHistory.slice(0, 100);
  }
};

const User = mongoose.model('User', userSchema);

export default User;

