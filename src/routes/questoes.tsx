import { createFileRoute } from "@tanstack/react-router";
import { Layers } from "lucide-react";

import { PlaceholderPage } from "@/components/rakus/placeholder-page";

export const Route = createFileRoute("/questoes")({
  head: () => ({
    meta: [
      { title: "Banco de Questões — Rakus" },
      { name: "description", content: "Filtre questões clínicas por especialidade, tema e dificuldade." },
      { property: "og:title", content: "Banco de Questões — Rakus" },
      { property: "og:description", content: "Um banco de questões clínicas filtrável, em breve no Rakus." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      icon={Layers}
      title="Banco de Questões"
      description="Um repositório completo de questões clínicas para treinar fora da trilha."
      bullets={[
        "Filtros por especialidade, tema e dificuldade",
        "Modo prova cronometrado",
        "Estatística de acertos por assunto",
      ]}
    />
  ),
});
