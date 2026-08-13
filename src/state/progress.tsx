import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { lessons } from "@/data/lessons";
import type { ChallengeProgress, LessonStatus, UserProgress } from "@/types/learning";

const STORAGE_KEY = "rakus.progress.v1";

export const XP_PER_CORRECT = 10;
export const XP_LESSON_BONUS = 50;

const initialProgress: UserProgress = {
  hearts: 5,
  streakDays: 12,
  xp: 2450,
  weeklyXp: 620,
  lessons: {
    "reconhecimento-do-choque": {
      lessonId: "reconhecimento-do-choque",
      completed: true,
      bestScore: 5,
      totalQuestions: 5,
    },
    "indice-de-choque": {
      lessonId: "indice-de-choque",
      completed: true,
      bestScore: 4,
      totalQuestions: 5,
    },
  },
  history: [],
};

interface LessonResultInput {
  lessonId: string;
  correct: number;
  total: number;
  attempts: ChallengeProgress[];
}

interface ProgressContextValue {
  progress: UserProgress;
  getLessonStatus: (lessonId: string) => LessonStatus;
  currentLessonId: string | undefined;
  completionPercent: number;
  completeLesson: (input: LessonResultInput) => void;
  clearMistake: (challengeId: string) => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

const orderedLessons = [...lessons].sort((a, b) => a.order - b.order);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(initialProgress);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProgress(JSON.parse(raw) as UserProgress);
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  const persist = useCallback((next: UserProgress) => {
    setProgress(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  }, []);

  const getLessonStatus = useCallback(
    (lessonId: string): LessonStatus => {
      const index = orderedLessons.findIndex((l) => l.id === lessonId);
      if (index < 0) return "locked";
      if (progress.lessons[lessonId]?.completed) return "completed";
      const firstUnfinished = orderedLessons.findIndex((l) => !progress.lessons[l.id]?.completed);
      if (index === firstUnfinished) return "current";
      // the lesson right after the current one is previewable, the rest is locked
      return index === firstUnfinished + 1 ? "available" : "locked";
    },
    [progress.lessons],
  );

  const currentLessonId = useMemo(
    () => orderedLessons.find((l) => !progress.lessons[l.id]?.completed)?.id,
    [progress.lessons],
  );

  const completionPercent = useMemo(() => {
    const done = orderedLessons.filter((l) => progress.lessons[l.id]?.completed).length;
    return Math.round((done / orderedLessons.length) * 100);
  }, [progress.lessons]);

  const completeLesson = useCallback(
    ({ lessonId, correct, total, attempts }: LessonResultInput) => {
      const earned = correct * XP_PER_CORRECT + XP_LESSON_BONUS;
      const previous = progress.lessons[lessonId];
      const wrongIds = new Set(attempts.filter((a) => !a.isCorrect).map((a) => a.challengeId));
      const history = [
        ...progress.history.filter((h) => !attempts.some((a) => a.challengeId === h.challengeId)),
        ...attempts.filter((a) => wrongIds.has(a.challengeId)),
      ];
      persist({
        ...progress,
        xp: progress.xp + earned,
        weeklyXp: progress.weeklyXp + earned,
        lessons: {
          ...progress.lessons,
          [lessonId]: {
            lessonId,
            completed: true,
            bestScore: Math.max(previous?.bestScore ?? 0, correct),
            totalQuestions: total,
            completedAt: new Date().toISOString(),
          },
        },
        history,
      });
    },
    [persist, progress],
  );

  const clearMistake = useCallback(
    (challengeId: string) => {
      persist({ ...progress, history: progress.history.filter((h) => h.challengeId !== challengeId) });
    },
    [persist, progress],
  );

  const reset = useCallback(() => persist(initialProgress), [persist]);

  const value = useMemo(
    () => ({
      progress,
      getLessonStatus,
      currentLessonId,
      completionPercent,
      completeLesson,
      clearMistake,
      reset,
    }),
    [progress, getLessonStatus, currentLessonId, completionPercent, completeLesson, clearMistake, reset],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
