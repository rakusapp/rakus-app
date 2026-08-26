import { useSyncExternalStore } from "react";

import type { Challenge } from "@/types/learning";

import { seedDB } from "./seed";
import type {
  ContentDB,
  ContentLesson,
  ContentUnit,
  Exercise,
  ExerciseOption,
  Reference,
  Track,
} from "./types";

const STORAGE_KEY = "rakus.content.v1";

let db: ContentDB = seedDB;
let hydrated = false;
const listeners = new Set<() => void>();

function load(): ContentDB {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ContentDB;
  } catch {
    /* ignore corrupt storage */
  }
  return seedDB;
}

function emit() {
  listeners.forEach((l) => l());
}

function setDB(next: ContentDB) {
  db = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
  emit();
}

function subscribe(listener: () => void) {
  if (!hydrated) {
    hydrated = true;
    db = load();
    queueMicrotask(emit);
  }
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => db;
const getServerSnapshot = () => seedDB;

export function useContent(): ContentDB {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function getContent(): ContentDB {
  return db;
}

export function resetContent() {
  setDB(seedDB);
}

export function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

/* ------------------------------------------------------------------ mutations */

type Key = keyof ContentDB;

function replace<T extends { id: string }>(list: T[], item: T): T[] {
  return list.some((x) => x.id === item.id)
    ? list.map((x) => (x.id === item.id ? item : x))
    : [...list, item];
}

function save<K extends Key>(key: K, item: ContentDB[K][number]) {
  setDB({ ...db, [key]: replace(db[key] as { id: string }[], item as { id: string }) } as ContentDB);
}

export const upsertTrack = (t: Track) => save("tracks", t);
export const upsertUnit = (u: ContentUnit) => save("units", u);
export const upsertLesson = (l: ContentLesson) => save("lessons", l);
export const upsertExercise = (e: Exercise) => save("exercises", e);
export const upsertOption = (o: ExerciseOption) => save("options", o);
export const upsertReference = (r: Reference) => save("references", r);

export function deleteTrack(id: string) {
  const units = db.units.filter((u) => u.trackId !== id);
  const unitIds = new Set(units.map((u) => u.id));
  const lessons = db.lessons.filter((l) => unitIds.has(l.unitId));
  const lessonIds = new Set(lessons.map((l) => l.id));
  const exercises = db.exercises.filter((e) => lessonIds.has(e.lessonId));
  const exIds = new Set(exercises.map((e) => e.id));
  setDB({
    tracks: db.tracks.filter((t) => t.id !== id),
    units,
    lessons,
    exercises,
    options: db.options.filter((o) => exIds.has(o.exerciseId)),
    references: db.references.filter((r) => exIds.has(r.exerciseId)),
  });
}

export function deleteUnit(id: string) {
  const lessons = db.lessons.filter((l) => l.unitId !== id);
  const lessonIds = new Set(lessons.map((l) => l.id));
  const exercises = db.exercises.filter((e) => lessonIds.has(e.lessonId));
  const exIds = new Set(exercises.map((e) => e.id));
  setDB({
    ...db,
    units: db.units.filter((u) => u.id !== id),
    lessons,
    exercises,
    options: db.options.filter((o) => exIds.has(o.exerciseId)),
    references: db.references.filter((r) => exIds.has(r.exerciseId)),
  });
}

export function deleteLesson(id: string) {
  const exercises = db.exercises.filter((e) => e.lessonId !== id);
  const exIds = new Set(exercises.map((e) => e.id));
  setDB({
    ...db,
    lessons: db.lessons.filter((l) => l.id !== id),
    exercises,
    options: db.options.filter((o) => exIds.has(o.exerciseId)),
    references: db.references.filter((r) => exIds.has(r.exerciseId)),
  });
}

export function deleteExercise(id: string) {
  setDB({
    ...db,
    exercises: db.exercises.filter((e) => e.id !== id),
    options: db.options.filter((o) => o.exerciseId !== id),
    references: db.references.filter((r) => r.exerciseId !== id),
  });
}

export const deleteOption = (id: string) =>
  setDB({ ...db, options: db.options.filter((o) => o.id !== id) });
export const deleteReference = (id: string) =>
  setDB({ ...db, references: db.references.filter((r) => r.id !== id) });

/** Moves an item up/down inside a sibling group and renumbers `order`. */
export function move<K extends "tracks" | "units" | "lessons" | "exercises">(
  key: K,
  id: string,
  direction: -1 | 1,
  siblingOf: (item: ContentDB[K][number]) => boolean,
) {
  const list = db[key] as ({ id: string; order: number } & Record<string, unknown>)[];
  const siblings = list
    .filter((i) => siblingOf(i as ContentDB[K][number]))
    .sort((a, b) => a.order - b.order);
  const index = siblings.findIndex((i) => i.id === id);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= siblings.length) return;
  const reordered = [...siblings];
  const [item] = reordered.splice(index, 1);
  reordered.splice(target, 0, item!);
  const orderById = new Map(reordered.map((i, idx) => [i.id, idx + 1]));
  setDB({
    ...db,
    [key]: list.map((i) => (orderById.has(i.id) ? { ...i, order: orderById.get(i.id)! } : i)),
  } as ContentDB);
}

/* ------------------------------------------------------------------ selectors */

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export const activeTracks = (d: ContentDB) => d.tracks.filter((t) => t.active).sort(byOrder);
export const unitsOfTrack = (d: ContentDB, trackId: string) =>
  d.units.filter((u) => u.trackId === trackId).sort(byOrder);
export const lessonsOfUnit = (d: ContentDB, unitId: string) =>
  d.lessons.filter((l) => l.unitId === unitId).sort(byOrder);
export const exercisesOfLesson = (d: ContentDB, lessonId: string) =>
  d.exercises.filter((e) => e.lessonId === lessonId).sort(byOrder);
export const optionsOfExercise = (d: ContentDB, exerciseId: string) =>
  d.options.filter((o) => o.exerciseId === exerciseId).sort(byOrder);
export const referencesOfExercise = (d: ContentDB, exerciseId: string) =>
  d.references.filter((r) => r.exerciseId === exerciseId);

/** The lessons the student-facing app plays, in order (active track/unit/lesson only). */
export function studentLessons(d: ContentDB): ContentLesson[] {
  const trackIds = new Set(d.tracks.filter((t) => t.active).map((t) => t.id));
  const unitIds = new Set(
    d.units.filter((u) => u.active && trackIds.has(u.trackId)).sort(byOrder).map((u) => u.id),
  );
  return d.lessons.filter((l) => l.active && unitIds.has(l.unitId)).sort(byOrder);
}

const LABELS = ["A", "B", "C", "D", "E", "F"];

/** Maps editable exercises to the Challenge shape the lesson player already renders. */
export function challengesOfLesson(d: ContentDB, lessonId: string): Challenge[] {
  return exercisesOfLesson(d, lessonId)
    .filter((e) => e.active)
    .map((e) => ({
      id: e.id,
      lessonId: e.lessonId,
      type: e.type,
      order: e.order,
      difficulty: e.difficulty,
      ...(e.vignette ? { vignette: e.vignette } : {}),
      ...(e.vitals ? { vitals: e.vitals } : {}),
      question: e.question,
      explanation: e.explanation,
      ...(e.clinicalPearl ? { clinicalPearl: e.clinicalPearl } : {}),
      options: optionsOfExercise(d, e.id).map((o, i) => ({
        id: o.id,
        challengeId: e.id,
        label: LABELS[i] ?? String(i + 1),
        text: o.text,
        isCorrect: o.correct,
        ...(o.rationale ? { rationale: o.rationale } : {}),
      })),
    }));
}

export function challengeById(d: ContentDB, id: string): Challenge | undefined {
  const ex = d.exercises.find((e) => e.id === id);
  if (!ex) return undefined;
  return challengesOfLesson(d, ex.lessonId).find((c) => c.id === id);
}
