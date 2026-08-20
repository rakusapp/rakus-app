import { Link } from "@tanstack/react-router";

import { LessonNode } from "@/components/rakus/lesson-node";
import { CurrentLessonIndicator, LessonLabel } from "@/components/rakus/lesson-label";
import { cn } from "@/lib/utils";
import type { Lesson, LessonStatus } from "@/types/learning";

export interface PathLesson {
  id: string;
  title: string;
  description?: string | undefined;
  state: LessonStatus;
  progressPercentage?: number | undefined;
  score?: string | undefined;
}

/** center → right → far right → center → left → far left → center */
export function indentationLevel(index: number) {
  const cycle = index % 8;
  if (cycle <= 2) return cycle;
  if (cycle <= 6) return 4 - cycle;
  return cycle - 8;
}

export function toPathLessons(
  lessons: Lesson[],
  getState: (id: string) => LessonStatus,
  scoreOf?: (id: string) => string | undefined,
): PathLesson[] {
  return lessons.map((l) => ({
    id: l.id,
    title: l.title,
    description: l.subtitle,
    state: getState(l.id),
    score: scoreOf?.(l.id),
  }));
}

function LessonRow({ lesson, index }: { lesson: PathLesson; index: number }) {
  const level = indentationLevel(index);
  const locked = lesson.state === "locked";
  const labelSide = level > 0 ? "right" : "left";

  const inner = (
    <div className="group flex items-center gap-4">
      {labelSide === "right" ? (
        <LessonLabel
          title={lesson.title}
          description={lesson.description}
          status={lesson.state}
          align="right"
          score={lesson.score}
          className="order-first"
        />
      ) : null}
      <div className="relative shrink-0">
        {lesson.state === "current" ? (
          <CurrentLessonIndicator label={lesson.progressPercentage ? "Continuar" : "Começar"} />
        ) : null}
        <LessonNode status={lesson.state} progressPercentage={lesson.progressPercentage} />
      </div>
      {labelSide === "left" ? (
        <LessonLabel
          title={lesson.title}
          description={lesson.description}
          status={lesson.state}
          score={lesson.score}
        />
      ) : null}
    </div>
  );

  return (
    <li
      className={cn("flex", level === 0 ? "justify-center" : labelSide === "right" ? "justify-start" : "justify-end")}
      style={{ transform: `translateX(calc(var(--step) * ${level}))` }}
    >
      {locked ? (
        <div aria-disabled className="cursor-not-allowed opacity-65">
          {inner}
        </div>
      ) : (
        <Link
          to="/licao/$lessonId"
          params={{ lessonId: lesson.id }}
          aria-label={lesson.title}
          className="rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          {inner}
        </Link>
      )}
    </li>
  );
}

export function UnitSection({
  title,
  description,
  lessons,
}: {
  title: string;
  description: string;
  lessons: PathLesson[];
}) {
  return (
    <section className="mt-8">
      <header className="relative rounded-2xl border-l-2 border-primary/60 bg-primary-soft/50 py-3 pl-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-primary">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </header>
      <LearningPath lessons={lessons} />
    </section>
  );
}

export function LearningPath({ lessons }: { lessons: PathLesson[] }) {
  return (
    <ol
      className="relative mx-auto mt-10 flex w-full max-w-md flex-col gap-10 overflow-hidden pb-6 [--step:22px] sm:gap-12 sm:[--step:38px]"
      style={{ maskImage: undefined }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-4 left-1/2 -z-10 w-px -translate-x-1/2 border-l border-dashed border-border"
      />
      {lessons.map((lesson, i) => (
        <LessonRow key={lesson.id} lesson={lesson} index={i} />
      ))}
    </ol>
  );
}
