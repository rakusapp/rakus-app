import { Link } from "@tanstack/react-router";
import { PartyPopper, Sparkles, Target } from "lucide-react";

import { Button } from "@/components/ui/button";

interface LessonResultProps {
  lessonTitle: string;
  correct: number;
  total: number;
  xpEarned: number;
  hasMistakes: boolean;
  onReviewMistakes: () => void;
  onContinue: () => void;
}

export function LessonResult({
  lessonTitle,
  correct,
  total,
  xpEarned,
  hasMistakes,
  onReviewMistakes,
  onContinue,
}: LessonResultProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md animate-rise rounded-3xl border border-border bg-card p-7 text-center shadow-raise">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <PartyPopper className="size-7" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">Lição concluída</h1>
        <p className="mt-2 text-sm text-muted-foreground">Você concluiu {lessonTitle}</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-secondary p-4">
            <Target className="mx-auto size-5 text-primary" />
            <p className="mt-2 text-xl font-semibold tabular-nums">
              {correct} / {total}
            </p>
            <p className="text-xs text-muted-foreground">corretas</p>
          </div>
          <div className="rounded-2xl bg-gold-soft p-4">
            <Sparkles className="mx-auto size-5 text-gold" />
            <p className="mt-2 text-xl font-semibold tabular-nums">+{xpEarned} XP</p>
            <p className="text-xs text-muted-foreground">conquistados</p>
          </div>
        </div>

        <div className="mt-7 space-y-2.5">
          <Button onClick={onContinue} className="h-12 w-full rounded-xl text-base font-semibold">
            Continuar
          </Button>
          {hasMistakes ? (
            <Button
              onClick={onReviewMistakes}
              variant="outline"
              className="h-12 w-full rounded-xl text-base font-semibold"
            >
              Revisar erros
            </Button>
          ) : (
            <Button asChild variant="ghost" className="h-12 w-full rounded-xl">
              <Link to="/">Voltar para a trilha</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
