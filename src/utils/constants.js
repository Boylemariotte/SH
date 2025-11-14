export const SCREENS = {
  INPUT: 'input',
  LOADING: 'loading',
  QUIZ: 'quiz',
  RESULTS: 'results'
};

export const DIFFICULTY_LEVELS = {
  FACIL: 'facil',
  MEDIO: 'medio',
  DIFICIL: 'dificil',
  EXPERTO: 'experto'
};

export const QUESTION_COUNTS = [3, 5, 10, 15, 20];

export const DEFAULT_CONFIG = {
  difficulty: DIFFICULTY_LEVELS.MEDIO,
  numQuestions: 5,
  initialLives: 3
};
