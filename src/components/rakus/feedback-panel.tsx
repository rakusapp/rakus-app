import { CheckCircle2, Lightbulb, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Challenge, ChallengeOption } from "@/types/learning";

interface FeedbackPanelProps {
  challenge: Challenge;
  selected: ChallengeOption;
  isCorrect: boolean;
  isLast: boolean;
  onContinue: () => void;
}

export function FeedbackPanel({ challenge, selected, isCorrect, isLast, onContinue }: FeedbackPanelProps) {
  const correct = challenge.options.find((o) => o.isCorrect);

  return (
    <div
      className={cn(
        "sticky bottom-20 z-10 mt-6 animate-rise rounded-3xl border-2 p-5 shadow-raise lg:bottom-6",
        isCorrect ? "border-success bg-success-soft" : "border-destructive bg-destructive-soft",
      )}
    >
      <div className="flex items-center gap-2">
        {isCorrect ? (
          <CheckCircle2 className="size-5 text-success" />
        ) : (
          <XCircle className="size-5 text-destructive" />
        )}
        <p className={cn("text-base font-semibold", isCorrect ? "text-success" : "text-destructive")}>
          {isCorrect ? "Correto!" : "Resposta incorreta"}
        </p>
        {isCorrect ? (
          <span className="ml-auto rounded-full bg-card px-2.5 py-1 text-xs font-semibold text-primary">
            +10 XP
          </span>
        ) : null}
      </div>

      {!isCorrect && correct ? (
        <p className="mt-3 text-sm font-medium">
          Resposta correta: {correct.label}. {correct.text}
        </p>
      ) : null}

      <p className="mt-2 text-sm leading-relaxed text-foreground/90">{challenge.explanation}</p>

      {!isCorrect && selected.rationale ? (
        <p className="mt-2 text-sm leading-relaxed text-foreground/80">
          <span className="font-medium">Por que {selected.label} está errada: </span>
          {selected.rationale}
        </p>
      ) : null}

      {challenge.clinicalPearl ? (
        <div className="mt-4 flex gap-3 rounded-2xl bg-card p-3.5">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-gold" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Pearl clínica
            </p>
            <p className="mt-1 text-sm leading-relaxed">{challenge.clinicalPearl}</p>
          </div>
        </div>
      ) : null}

      <Button onClick={onContinue} className="mt-5 h-12 w-full rounded-xl text-base font-semibold">
        {isLast ? "Ver resultado" : "Continuar"}
      </Button>
    </div>
  );
}
