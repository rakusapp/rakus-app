import { createFileRoute } from "@tanstack/react-router";
import { Trophy } from "lucide-react";

import { PlaceholderPage } from "@/components/rakus/placeholder-page";

export const Route = createFileRoute("/ranking")({
  head: () => ({
    meta: [
      { title: "Ranking — Rakus" },
      { name: "description", content: "Compare seu XP semanal com outros estudantes de medicina." },
      { property: "og:title", content: "Ranking — Rakus" },
      { property: "og:description", content: "Ligas semanais de XP entre estudantes, em breve no Rakus." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      icon={Trophy}
      title="Ranking"
      description="Ligas semanais de XP entre estudantes e residentes."
      bullets={["Ligas por faixa de XP", "Ranking por especialidade", "Histórico de posições"]}
    />
  ),
});
