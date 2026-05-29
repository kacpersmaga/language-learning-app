export const createUserProgress = () => ({
  completedLessons: [],
  lessonScores: {},
  currentLesson: null,
  currentStage: 0,
  totalPoints: 0,
  lastStudyDate: null,
  streak: 0,
});

export const calculateScore = (correctAnswers, totalQuestions) => {
  return Math.round((correctAnswers / totalQuestions) * 100);
};

export const getGrade = (score) => {
  if (score >= 90) return { grade: 'A', label: 'Excellent!' };
  if (score >= 75) return { grade: 'B', label: 'Good job!' };
  if (score >= 60) return { grade: 'C', label: 'Keep practicing!' };
  return { grade: 'D', label: 'Try again!' };
};
