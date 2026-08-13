import type { Specialty, Unit } from "@/types/learning";

export const specialties: Specialty[] = [
  {
    id: "medicina-intensiva",
    title: "Medicina Intensiva",
    description: "Reconhecimento e manejo do paciente grave.",
    icon: "activity",
  },
];

export const units: Unit[] = [
  {
    id: "choque",
    specialtyId: "medicina-intensiva",
    title: "Choque",
    description: "Do reconhecimento precoce aos perfis hemodinâmicos.",
    order: 1,
  },
];
