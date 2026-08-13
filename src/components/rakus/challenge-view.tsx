import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Challenge, ChallengeOption } from "@/types/learning";

interface ChallengeViewProps {
  challenge: Challenge;
  selectedOptionId: string | null;
  answered: boolean;
  onSelect: (optionId: string) => void;
}

/**
 * Dispatcher by challenge type. Only `multipleChoice` is implemented in this
 * MVP; new types plug in here without touching the lesson engine.
 */
export function ChallengeView(props: ChallengeViewProps) {
  switch (props.challenge.type) {
    case "multipleChoice":
    case "trueFalse":
    case "clinicalCase":
      return <MultipleChoiceChallenge {...props} />;
    default:
      return (
        <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          Este tipo de questão ainda não está disponível.
        </p>
      );
  }
}

function optionState(option: ChallengeOption, selectedOptionId: string | null, answered: boolean) {
  if (!answered) return selectedOptionId === option.id ? "selected" : "idle";
  if (option.isCorrect) return "correct";
  if (selectedOptionId === option.id) return "wrong";
  return "muted";
}

function MultipleChoiceChallenge({ challenge, selectedOptionId, answered, onSelect }: ChallengeViewProps) {
  return (
    <div className="animate-rise">
      {challenge.vignette ? (
        <p className="rounded-2xl bg-secondary p-4 text-sm leading-relaxed text-secondary-foreground">
          {challenge.vignette}
        </p>
      ) : null}

      {challenge.vitals?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {challenge.vitals.map((v) => (
            <span
              key={v.label}
              className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium shadow-soft"
            >
              <span className="text-muted-foreground">{v.label}: </span>
              <span className="tabular-nums">{v.value}</span>
            </span>
          ))}
        </div>
      ) : null}

      <h2 className="mt-5 text-lg font-semibold leading-snug tracking-tight sm:text-xl">
        {challenge.question}
      </h2>

      <div className="mt-5 space-y-2.5">
        {challenge.options.map((option) => {
          const state = optionState(option, selectedOptionId, answered);
          return (
            <button
              key={option.id}
              type="button"
              disabled={answered}
              onClick={() => onSelect(option.id)}
              className={cn(
                "flex w-full items-start gap-3 rounded-2xl border-2 bg-card p-4 text-left text-sm transition-all",
                state === "idle" && "border-border hover:border-primary/40 hover:shadow-soft",
                state === "selected" && "border-primary bg-primary-soft shadow-soft",
                state === "correct" && "border-success bg-success-soft",
                state === "wrong" && "border-destructive bg-destructive-soft",
                state === "muted" && "border-border opacity-60",
              )}
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold",
                  state === "correct" && "border-success bg-success text-success-foreground",
                  state === "wrong" && "border-destructive bg-destructive text-destructive-foreground",
                  (state === "idle" || state === "muted") && "border-border text-muted-foreground",
                  state === "selected" && "border-primary bg-primary text-primary-foreground",
                )}
              >
                {state === "correct" ? (
                  <Check className="size-4" />
                ) : state === "wrong" ? (
                  <X className="size-4" />
                ) : (
                  option.label
                )}
              </span>
              <span className="pt-0.5 leading-relaxed">{option.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
