import { Link } from "@tanstack/react-router";
import { Heart, X } from "lucide-react";
import { useMemo, useState } from "react";

import { ChallengeView } from "@/components/rakus/challenge-view";
import { FeedbackPanel } from "@/components/rakus/feedback-panel";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProgress, XP_PER_CORRECT } from "@/state/progress";
import type { Challenge, ChallengeProgress } from "@/types/learning";

export interface LessonRunnerResult {
  correct: number;
  total: number;
  attempts: ChallengeProgress[];
}

interface LessonRunnerProps {
  title: string;
  subtitle: string;
  challenges: Challenge[];
  onFinish: (result: LessonRunnerResult) => void;
  exitTo: "/" | "/revisar";
}

export function LessonRunner({ title, subtitle, challenges, onFinish, exitTo }: LessonRunnerProps) {
  const { progress } = useProgress();
  const [index, setIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [attempts, setAttempts] = useState<ChallengeProgress[]>([]);
  const [xpPop, setXpPop] = useState(0);

  const challenge = challenges[index];
  const selected = useMemo(
    () => challenge?.options.find((o) => o.id === selectedOptionId) ?? null,
    [challenge, selectedOptionId],
  );
  const isCorrect = Boolean(selected?.isCorrect);
  const isLast = index === challenges.length - 1;

  if (!challenge) return null;

  const confirm = () => {
    if (!selected) return;
    setAnswered(true);
    setAttempts((prev) => [
      ...prev,
      {
        challengeId: challenge.id,
        lessonId: challenge.lessonId,
        selectedOptionId: selected.id,
        isCorrect: selected.isCorrect,
        answeredAt: new Date().toISOString(),
      },
    ]);
    if (selected.isCorrect) setXpPop((n) => n + 1);
  };

  const advance = () => {
    const nextAttempts = attempts;
    if (isLast) {
      onFinish({
        correct: nextAttempts.filter((a) => a.isCorrect).length,
        total: challenges.length,
        attempts: nextAttempts,
      });
      return;
    }
    setIndex((i) => i + 1);
    setSelectedOptionId(null);
    setAnswered(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Button asChild variant="ghost" size="icon" className="rounded-xl">
            <Link to={exitTo} aria-label="Sair da lição">
              <X className="size-5" />
            </Link>
          </Button>
          <Progress value={((index + (answered ? 1 : 0)) / challenges.length) * 100} className="h-3" />
          <div className="relative flex items-center gap-1 text-sm font-semibold">
            <Heart className="size-4 text-destructive" />
            <span className="tabular-nums">{progress.hearts}</span>
            {xpPop > 0 ? (
              <span
                key={xpPop}
                className="animate-xp-float pointer-events-none absolute -top-1 right-0 whitespace-nowrap text-xs font-bold text-primary"
              >
                +{XP_PER_CORRECT} XP
              </span>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-40 pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {subtitle}
        </p>
        <h1 className="mt-1 text-sm font-medium text-muted-foreground">
          {title} · Questão {index + 1} de {challenges.length}
        </h1>

        <div className="mt-5">
          <ChallengeView
            challenge={challenge}
            selectedOptionId={selectedOptionId}
            answered={answered}
            onSelect={setSelectedOptionId}
          />
        </div>

        {answered && selected ? (
          <FeedbackPanel
            challenge={challenge}
            selected={selected}
            isCorrect={isCorrect}
            isLast={isLast}
            onContinue={advance}
          />
        ) : (
          <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 p-4 backdrop-blur">
            <div className="mx-auto max-w-2xl">
              <Button
                onClick={confirm}
                disabled={!selected}
                className="h-12 w-full rounded-xl text-base font-semibold"
              >
                Confirmar
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
