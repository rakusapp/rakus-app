import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/rakus/app-shell";
import { LessonRunner } from "@/components/rakus/lesson-runner";
import { Button } from "@/components/ui/button";
import { getChallengeById } from "@/data/challenges";
import { lessons } from "@/data/lessons";
import { useProgress } from "@/state/progress";

export const Route = createFileRoute("/revisar")({
  head: () => ({
    meta: [
      { title: "Revisar erros — Rakus" },
      {
        name: "description",
        content: "Refaça apenas as questões clínicas que você errou e consolide o raciocínio médico.",
      },
      { property: "og:title", content: "Revisar erros — Rakus" },
      {
        property: "og:description",
        content: "Sua fila de revisão: só as questões que você errou.",
      },
    ],
  }),
  component: ReviewPage,
});

function ReviewPage() {
  const { progress, clearMistake } = useProgress();
  const [running, setRunning] = useState(false);

  const mistakes = progress.history
    .filter((h) => !h.isCorrect)
    .map((h) => ({ attempt: h, challenge: getChallengeById(h.challengeId) }))
    .filter((m): m is { attempt: typeof m.attempt; challenge: NonNullable<typeof m.challenge> } =>
      Boolean(m.challenge),
    );

  if (running && mistakes.length > 0) {
    return (
      <LessonRunner
        title="Revisão de erros"
        subtitle="Fila de revisão"
        challenges={mistakes.map((m) => m.challenge)}
        exitTo="/revisar"
        onFinish={(r) => {
          r.attempts.filter((a) => a.isCorrect).forEach((a) => clearMistake(a.challengeId));
          setRunning(false);
        }}
      />
    );
  }

  return (
    <AppShell>
      <div className="animate-rise">
        <h1 className="text-2xl font-semibold tracking-tight">Revisar</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          As questões que você errou ficam aqui até você acertá-las.
        </p>

        {mistakes.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-border bg-card p-8 text-center shadow-soft">
            <CheckCircle2 className="mx-auto size-8 text-success" />
            <p className="mt-4 font-semibold">Nenhum erro pendente</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Continue avançando na trilha — os erros aparecem aqui automaticamente.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6 space-y-3">
              {mistakes.map(({ challenge }) => {
                const lesson = lessons.find((l) => l.id === challenge.lessonId);
                return (
                  <div
                    key={challenge.id}
                    className="rounded-2xl border border-border bg-card p-4 shadow-soft"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {lesson?.title ?? "Lição"}
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-sm font-medium leading-relaxed">
                      {challenge.question}
                    </p>
                  </div>
                );
              })}
            </div>
            <Button
              onClick={() => setRunning(true)}
              className="mt-6 h-12 w-full rounded-xl text-base font-semibold sm:w-auto sm:px-8"
            >
              <RotateCcw className="size-4" />
              Revisar {mistakes.length} {mistakes.length === 1 ? "questão" : "questões"}
            </Button>
          </>
        )}
      </div>
    </AppShell>
  );
}
