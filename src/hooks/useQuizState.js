import { useState, useCallback } from 'react';

const INITIAL_LIVES = 3;
const BASE_POINTS = 100;
const STREAK_BONUS = 10;

export const useQuizState = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [streak, setStreak] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleAnswerSelect = useCallback((index, correctAnswer) => {
    if (isAnswered) return;
    
    setSelectedAnswer(index);
    setIsAnswered(true);
    
    const isCorrect = index === correctAnswer;
    setUserAnswers(prev => [...prev, { 
      questionIndex: currentQuestion, 
      answer: index, 
      correct: isCorrect 
    }]);
    
    if (isCorrect) {
      const points = BASE_POINTS + (streak * STREAK_BONUS);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1000);
    } else {
      setLives(prev => prev - 1);
      setStreak(0);
    }
  }, [isAnswered, currentQuestion, streak]);

  const handleNext = useCallback((totalQuestions) => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      return false; // Not finished
    }
    return true; // Finished
  }, [currentQuestion]);

  const resetQuiz = useCallback(() => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setLives(INITIAL_LIVES);
    setStreak(0);
    setUserAnswers([]);
    setShowCelebration(false);
  }, []);

  return {
    currentQuestion,
    selectedAnswer,
    isAnswered,
    score,
    lives,
    streak,
    userAnswers,
    showCelebration,
    handleAnswerSelect,
    handleNext,
    resetQuiz
  };
};
