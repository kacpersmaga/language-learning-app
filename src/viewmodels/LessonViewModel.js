import { useState, useCallback } from 'react';
import { DictionaryApiService } from '../services/DictionaryApiService';

export const useLessonViewModel = (lesson) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [wordDetails, setWordDetails] = useState({});
  const [loadingWord, setLoadingWord] = useState(false);

  const totalStages = lesson?.stages?.length || 0;
  const currentStage = lesson?.stages?.[currentStageIndex] || null;
  const isLastStage = currentStageIndex === totalStages - 1;

  const goNext = useCallback(() => {
    if (!isLastStage) {
      setCurrentStageIndex(i => i + 1);
      setQuizSubmitted(false);
    }
  }, [isLastStage]);

  const goPrev = useCallback(() => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex(i => i - 1);
      setQuizSubmitted(false);
    }
  }, [currentStageIndex]);

  const answerQuestion = useCallback((questionId, answerIndex) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  }, [quizSubmitted]);

  const submitQuiz = useCallback(() => {
    setQuizSubmitted(true);
  }, []);

  const getQuizResults = useCallback(() => {
    const questions = currentStage?.content?.questions || [];
    const correct = questions.filter(
      q => quizAnswers[q.id] === q.correctIndex
    ).length;
    return { correct, total: questions.length };
  }, [currentStage, quizAnswers]);

  const lookupWord = useCallback(async (word) => {
    if (wordDetails[word]) return;
    setLoadingWord(true);
    const result = await DictionaryApiService.lookupWord(word);
    if (result) {
      setWordDetails(prev => ({ ...prev, [word]: result }));
    }
    setLoadingWord(false);
  }, [wordDetails]);

  const reset = useCallback(() => {
    setCurrentStageIndex(0);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setWordDetails({});
  }, []);

  return {
    currentStage,
    currentStageIndex,
    totalStages,
    isLastStage,
    quizAnswers,
    quizSubmitted,
    wordDetails,
    loadingWord,
    goNext,
    goPrev,
    answerQuestion,
    submitQuiz,
    getQuizResults,
    lookupWord,
    reset,
  };
};
