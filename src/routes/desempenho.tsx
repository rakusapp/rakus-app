import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";

import { PlaceholderPage } from "@/components/rakus/placeholder-page";

export const Route = createFileRoute("/desempenho")({
  head: () => ({
    meta: [
      { title: "Desempenho — Rakus" },
      { name: "description", content: "Acompanhe acertos, evolução de XP e pontos fracos por tema clínico." },
      { property: "og:title", content: "Desempenho — Rakus" },
      { property: "og:description", content: "Suas métricas de estudo médico, em breve no Rakus." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      icon={BarChart3}
      title="Desempenho"
      description="Visualize sua evolução e descubra onde o raciocínio clínico ainda falha."
      bullets={[
        "Acurácia por especialidade e tema",
        "Curva de XP semanal",
        "Temas prioritários para revisão espaçada",
      ]}
    />
  ),
});
