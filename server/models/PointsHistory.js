import mongoose from 'mongoose';

const pointsHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  points: {
    type: Number,
    required: true
  },
  source: {
    type: String,
    enum: ['quiz', 'bonus', 'achievement', 'admin'],
    default: 'quiz'
  },
  quizAttempt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuizAttempt',
    default: null
  },
  metadata: {
    topic: String,
    difficulty: String,
    correctAnswers: Number,
    totalQuestions: Number
  },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

pointsHistorySchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('PointsHistory', pointsHistorySchema);

