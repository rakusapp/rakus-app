import type { Lesson } from "@/types/learning";

export const lessons: Lesson[] = [
  {
    id: "reconhecimento-do-choque",
    unitId: "choque",
    title: "Reconhecimento do choque",
    subtitle: "Sinais precoces de hipoperfusão",
    order: 1,
  },
  {
    id: "indice-de-choque",
    unitId: "choque",
    title: "Índice de choque",
    subtitle: "FC / PAS na beira do leito",
    order: 2,
  },
  {
    id: "choque-hipovolemico",
    unitId: "choque",
    title: "Choque hipovolêmico",
    subtitle: "Perda volêmica e hemorragia",
    order: 3,
  },
  {
    id: "choque-distributivo",
    unitId: "choque",
    title: "Choque distributivo",
    subtitle: "Sepse, anafilaxia e neurogênico",
    order: 4,
  },
  {
    id: "choque-cardiogenico",
    unitId: "choque",
    title: "Choque cardiogênico",
    subtitle: "Falência de bomba",
    order: 5,
  },
  {
    id: "choque-obstrutivo",
    unitId: "choque",
    title: "Choque obstrutivo",
    subtitle: "Tamponamento, TEP e pneumotórax",
    order: 6,
  },
];
