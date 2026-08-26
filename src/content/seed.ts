import { challenges } from "@/data/challenges";
import { lessons as seedLessons } from "@/data/lessons";
import { specialties, units as seedUnits } from "@/data/specialties";

import type { ContentDB } from "./types";

/** Builds the initial content database from the existing Medicina Intensiva content. */
export function buildSeed(): ContentDB {
  const tracks: ContentDB["tracks"] = [
    ...specialties.map((s, i) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      order: i + 1,
      active: true,
    })),
    {
      id: "antibioticos",
      title: "Antibióticos",
      description: "Escolha racional e uso clínico dos antimicrobianos.",
      order: 2,
      active: true,
    },
    {
      id: "farmacos-da-intubacao",
      title: "Fármacos da Intubação",
      description: "Sedativos, bloqueadores e sequência rápida.",
      order: 3,
      active: true,
    },
  ];

  const units = seedUnits.map((u) => ({
    id: u.id,
    trackId: u.specialtyId,
    title: u.title,
    description: u.description,
    order: u.order,
    active: true,
  }));

  const lessons = seedLessons.map((l) => ({
    id: l.id,
    unitId: l.unitId,
    title: l.title,
    description: l.subtitle,
    order: l.order,
    active: true,
  }));

  const exercises: ContentDB["exercises"] = [];
  const options: ContentDB["options"] = [];

  for (const c of challenges) {
    exercises.push({
      id: c.id,
      lessonId: c.lessonId,
      type: c.type,
      question: c.question,
      explanation: c.explanation,
      ...(c.clinicalPearl ? { clinicalPearl: c.clinicalPearl } : {}),
      difficulty: c.difficulty,
      order: c.order,
      active: true,
      ...(c.vignette ? { vignette: c.vignette } : {}),
      ...(c.vitals ? { vitals: c.vitals } : {}),
    });
    c.options.forEach((o, i) => {
      options.push({
        id: o.id,
        exerciseId: c.id,
        text: o.text,
        correct: o.isCorrect,
        order: i + 1,
        ...(o.rationale ? { rationale: o.rationale } : {}),
      });
    });
  }

  return { tracks, units, lessons, exercises, options, references: [] };
}

export const seedDB: ContentDB = buildSeed();
