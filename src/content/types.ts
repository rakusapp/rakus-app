// Editable content entities. Flat, PostgreSQL-ready rows so this can move to a
// real database later without reshaping the app.

import type { Difficulty, ChallengeType } from "@/types/learning";

export interface Track {
  id: string;
  title: string;
  description: string;
  order: number;
  active: boolean;
}

export interface ContentUnit {
  id: string;
  trackId: string;
  title: string;
  description: string;
  order: number;
  active: boolean;
}

export interface ContentLesson {
  id: string;
  unitId: string;
  title: string;
  description: string;
  order: number;
  active: boolean;
}

export interface Exercise {
  id: string;
  lessonId: string;
  type: ChallengeType;
  question: string;
  explanation: string;
  clinicalPearl?: string;
  difficulty: Difficulty;
  order: number;
  active: boolean;
  /** preserved from the original content */
  vignette?: string;
  vitals?: { label: string; value: string }[];
}

export interface ExerciseOption {
  id: string;
  exerciseId: string;
  text: string;
  correct: boolean;
  order: number;
  /** shown when the student picks this wrong option */
  rationale?: string;
}

export interface Reference {
  id: string;
  exerciseId: string;
  title: string;
  authors: string;
  source: string;
  year: string;
  url: string;
  notes?: string;
}

export interface ContentDB {
  tracks: Track[];
  units: ContentUnit[];
  lessons: ContentLesson[];
  exercises: Exercise[];
  options: ExerciseOption[];
  references: Reference[];
}
