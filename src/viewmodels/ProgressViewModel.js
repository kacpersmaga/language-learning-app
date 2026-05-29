import { useState, useEffect, useCallback } from 'react';
import { StorageService } from '../services/StorageService';
import { FirebaseService } from '../services/FirebaseService';
import { createUserProgress, calculateScore, getGrade } from '../models/UserProgress';
import { LESSONS } from '../models/Lesson';

export const useProgressViewModel = () => {
  const [progress, setProgress] = useState(createUserProgress());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = useCallback(async () => {
    setLoading(true);
    const local = await StorageService.getProgress();
    if (local) {
      setProgress(local);
    } else {
      const user = FirebaseService.getCurrentUser();
      if (user) {
        const remote = await FirebaseService.getUserProgress(user.uid);
        if (remote) {
          setProgress(remote);
          await StorageService.saveProgress(remote);
        }
      }
    }
    setLoading(false);
  }, []);

  const completeLesson = useCallback(async (lessonId, correctAnswers, totalQuestions) => {
    const score = calculateScore(correctAnswers, totalQuestions);
    const today = new Date().toDateString();

    setProgress(prev => {
      const isNew = !prev.completedLessons.includes(lessonId);
      const prevStreak = prev.streak || 0;
      const lastDate = prev.lastStudyDate;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const newStreak =
        lastDate === today
          ? prevStreak
          : lastDate === yesterday.toDateString()
          ? prevStreak + 1
          : 1;

      const updated = {
        ...prev,
        completedLessons: isNew ? [...prev.completedLessons, lessonId] : prev.completedLessons,
        lessonScores: { ...prev.lessonScores, [lessonId]: score },
        totalPoints: prev.totalPoints + (isNew ? score : 0),
        lastStudyDate: today,
        streak: newStreak,
      };

      StorageService.saveProgress(updated);
      const user = FirebaseService.getCurrentUser();
      if (user) FirebaseService.saveUserProgress(user.uid, updated);

      return updated;
    });

    return { score, grade: getGrade(score) };
  }, []);

  const resetProgress = useCallback(async () => {
    const fresh = createUserProgress();
    setProgress(fresh);
    await StorageService.saveProgress(fresh);
    const user = FirebaseService.getCurrentUser();
    if (user) await FirebaseService.saveUserProgress(user.uid, fresh);
  }, []);

  const getLessonStatus = useCallback(
    (lessonId) => {
      if (progress.completedLessons.includes(lessonId)) {
        return { completed: true, score: progress.lessonScores[lessonId] || 0 };
      }
      return { completed: false, score: 0 };
    },
    [progress]
  );

  const getStats = useCallback(() => {
    const total = LESSONS.filter(l => !l.comingSoon).length;
    const completed = progress.completedLessons.length;
    const avgScore =
      completed > 0
        ? Math.round(
            Object.values(progress.lessonScores).reduce((a, b) => a + b, 0) / completed
          )
        : 0;
    return { total, completed, avgScore, streak: progress.streak, totalPoints: progress.totalPoints };
  }, [progress]);

  return { progress, loading, completeLesson, resetProgress, getLessonStatus, getStats };
};
