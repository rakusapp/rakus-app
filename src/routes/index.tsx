import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Flame, Sparkles, Stethoscope } from "lucide-react";

import { AppShell } from "@/components/rakus/app-shell";
import { UnitSection } from "@/components/rakus/learning-path";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { lessons } from "@/data/lessons";
import { specialties, units } from "@/data/specialties";
import { useProgress } from "@/state/progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rakus — Trilha de Medicina Intensiva" },
      {
        name: "description",
        content:
          "Aprenda medicina em micro-lições gamificadas: questões clínicas, feedback imediato, XP e progressão. Medicina, uma questão de cada vez.",
      },
      { property: "og:title", content: "Rakus — Trilha de Medicina Intensiva" },
      {
        property: "og:description",
        content: "Micro-lições clínicas com feedback imediato, XP e progressão. Comece pela unidade Choque.",
      },
    ],
  }),
  component: LearnPage,
});

function LearnPage() {
  const { progress, getLessonStatus, currentLessonId, completionPercent } = useProgress();
  const navigate = useNavigate();
  const specialty = specialties[0]!;
  const unit = units[0]!;
  const orderedLessons = [...lessons].sort((a, b) => a.order - b.order);
  const currentLesson = orderedLessons.find((l) => l.id === currentLessonId);

  return (
    <AppShell>
      <section className="animate-rise rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Especialidade
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">{specialty.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{specialty.description}</p>
          </div>
          <span className="hidden size-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary sm:flex">
            <Stethoscope className="size-6" />
          </span>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{completionPercent}% concluído</span>
            <span className="text-muted-foreground">
              {orderedLessons.filter((l) => getLessonStatus(l.id) === "completed").length} de{" "}
              {orderedLessons.length} lições
            </span>
          </div>
          <Progress value={completionPercent} className="mt-2 h-2.5" />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-secondary p-3.5">
            <Sparkles className="size-4 text-primary" />
            <p className="mt-2 text-lg font-semibold tabular-nums">
              {progress.weeklyXp.toLocaleString("pt-BR")}
            </p>
            <p className="text-xs text-muted-foreground">XP esta semana</p>
          </div>
          <div className="rounded-2xl bg-gold-soft p-3.5">
            <Flame className="size-4 text-gold" />
            <p className="mt-2 text-lg font-semibold tabular-nums">{progress.streakDays} dias</p>
            <p className="text-xs text-muted-foreground">Sequência</p>
          </div>
        </div>

        {currentLesson ? (
          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-primary/25 bg-primary-soft p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Continuar estudando
              </p>
              <p className="mt-1 font-semibold">{currentLesson.title}</p>
            </div>
            <Button
              onClick={() => navigate({ to: "/licao/$lessonId", params: { lessonId: currentLesson.id } })}
              className="rounded-xl sm:w-auto"
            >
              Retomar
            </Button>
          </div>
        ) : null}
      </section>

      <UnitSection
        title={unit.title}
        description={unit.description}
        lessons={orderedLessons.map((lesson) => {
          const state = getLessonStatus(lesson.id);
          const record = progress.lessons[lesson.id];
          return {
            id: lesson.id,
            title: lesson.title,
            description: lesson.subtitle,
            state,
            score:
              state === "completed" && record
                ? `${record.bestScore}/${record.totalQuestions}`
                : undefined,
          };
        })}
      />
    </AppShell>
  );
}
