import { createFileRoute } from "@tanstack/react-router";
import { Crown } from "lucide-react";

import { PlaceholderPage } from "@/components/rakus/placeholder-page";

export const Route = createFileRoute("/pro")({
  head: () => ({
    meta: [
      { title: "Rakus Pro — Rakus" },
      { name: "description", content: "O plano avançado do Rakus para preparação médica intensiva." },
      { property: "og:title", content: "Rakus Pro" },
      { property: "og:description", content: "Trilhas completas e revisão espaçada avançada, em breve." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      icon={Crown}
      title="Rakus Pro"
      description="O plano avançado com todas as especialidades e revisão espaçada inteligente."
      bullets={[
        "Todas as especialidades liberadas",
        "Revisão espaçada personalizada",
        "Simulados completos com relatório",
      ]}
    />
  ),
});
