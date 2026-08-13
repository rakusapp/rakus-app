import { createFileRoute } from "@tanstack/react-router";
import { Target } from "lucide-react";

import { PlaceholderPage } from "@/components/rakus/placeholder-page";

export const Route = createFileRoute("/missoes")({
  head: () => ({
    meta: [
      { title: "Missões — Rakus" },
      { name: "description", content: "Desafios diários e semanais para manter a constância no estudo médico." },
      { property: "og:title", content: "Missões — Rakus" },
      { property: "og:description", content: "Metas diárias de XP e desafios clínicos, em breve no Rakus." },
    ],
  }),
  component: () => (
    <PlaceholderPage
      icon={Target}
      title="Missões"
      description="Metas curtas que sustentam a sequência de estudo sem transformar o aprendizado em jogo infantil."
      bullets={[
        "Meta diária de XP",
        "Missões semanais por especialidade",
        "Recompensas por consistência",
      ]}
    />
  ),
});
