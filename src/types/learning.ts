// Learning domain entities. Modeled as flat, PostgreSQL-ready rows so this can
// move to a real database (Lovable Cloud) without reshaping the app.

export type ChallengeType =
  | "multipleChoice"
  | "trueFalse"
  | "clinicalCase"
  | "image"
  | "ordering"
  | "flashcard"
  | "matching"
  | "aiConversation";

export type Difficulty = "facil" | "media" | "dificil";

export interface Specialty {
  id: string;
  title: string;
  description: string;
  /** lucide icon name, resolved in the presentation layer */
  icon: string;
}

export interface Unit {
  id: string;
  specialtyId: string;
  title: string;
  description: string;
  order: number;
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  subtitle: string;
  order: number;
}

export interface ChallengeOption {
  id: string;
  challengeId: string;
  label: string;
  text: string;
  isCorrect: boolean;
  /** shown when the student picks this wrong option */
  rationale?: string;
}

export interface Challenge {
  id: string;
  lessonId: string;
  type: ChallengeType;
  order: number;
  difficulty: Difficulty;
  /** optional clinical vignette rendered above the question */
  vignette?: string;
  /** structured vitals / labs rendered as chips */
  vitals?: { label: string; value: string }[];
  question: string;
  explanation: string;
  clinicalPearl?: string;
  options: ChallengeOption[];
}

export type LessonStatus = "completed" | "current" | "available" | "locked";

/** One attempt at a single challenge — the seed of the future SRS history. */
export interface ChallengeProgress {
  challengeId: string;
  lessonId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  answeredAt: string;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  bestScore: number;
  totalQuestions: number;
  completedAt?: string;
}

export interface UserProgress {
  hearts: number;
  streakDays: number;
  xp: number;
  weeklyXp: number;
  lessons: Record<string, LessonProgress>;
  history: ChallengeProgress[];
}
