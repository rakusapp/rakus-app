import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Flame, Lock, Play, Sparkles, Stethoscope } from "lucide-react";

import { AppShell } from "@/components/rakus/app-shell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { lessons } from "@/data/lessons";
import { specialties, units } from "@/data/specialties";
import { cn } from "@/lib/utils";
import { useProgress } from "@/state/progress";
import type { LessonStatus } from "@/types/learning";

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

const statusStyles: Record<LessonStatus, string> = {
  completed: "border-success/40 bg-success-soft",
  current: "border-primary bg-card shadow-raise ring-2 ring-primary/25",
  available: "border-border bg-card",
  locked: "border-border bg-muted/60",
};

function StatusIcon({ status }: { status: LessonStatus }) {
  const base = "flex size-11 shrink-0 items-center justify-center rounded-2xl";
  if (status === "completed")
    return (
      <span className={cn(base, "bg-success text-success-foreground")}>
        <Check className="size-5" />
      </span>
    );
  if (status === "current")
    return (
      <span className={cn(base, "bg-primary text-primary-foreground")}>
        <Play className="size-5" />
      </span>
    );
  if (status === "available")
    return (
      <span className={cn(base, "border-2 border-dashed border-primary/40 text-primary")}>
        <Stethoscope className="size-5" />
      </span>
    );
  return (
    <span className={cn(base, "bg-secondary text-muted-foreground")}>
      <Lock className="size-4" />
    </span>
  );
}

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

      <section className="mt-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {unit.title}
          </h2>
          <span className="text-xs text-muted-foreground">{unit.description}</span>
        </div>

        <ol className="relative mt-4 space-y-3 before:absolute before:left-[34px] before:top-4 before:bottom-4 before:w-px before:bg-border">
          {orderedLessons.map((lesson) => {
            const status = getLessonStatus(lesson.id);
            const locked = status === "locked";
            const record = progress.lessons[lesson.id];
            const content = (
              <div
                className={cn(
                  "relative flex items-center gap-4 rounded-2xl border-2 p-4 transition-all",
                  statusStyles[status],
                  !locked && "hover:shadow-raise",
                )}
              >
                <StatusIcon status={status} />
                <div className="min-w-0 flex-1">
                  <p className={cn("truncate font-semibold", locked && "text-muted-foreground")}>
                    {lesson.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{lesson.subtitle}</p>
                </div>
                {status === "current" ? (
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Atual
                  </span>
                ) : status === "completed" && record ? (
                  <span className="text-xs font-medium tabular-nums text-success">
                    {record.bestScore}/{record.totalQuestions}
                  </span>
                ) : null}
              </div>
            );

            return (
              <li key={lesson.id} className="relative">
                {locked ? (
                  <div aria-disabled className="cursor-not-allowed opacity-70">
                    {content}
                  </div>
                ) : (
                  <Link to="/licao/$lessonId" params={{ lessonId: lesson.id }} className="block">
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </section>
    </AppShell>
  );
}
