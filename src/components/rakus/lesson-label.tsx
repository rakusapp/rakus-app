import { cn } from "@/lib/utils";
import type { LessonStatus } from "@/types/learning";

interface LessonLabelProps {
  title: string;
  description?: string | undefined;
  status: LessonStatus;
  align?: "left" | "right" | undefined;
  score?: string | undefined;
  className?: string | undefined;
}

/** Compact text block that belongs to a node — no card, no borders. */
export function LessonLabel({
  title,
  description,
  status,
  align = "left",
  score,
  className,
}: LessonLabelProps) {
  return (
    <div
      className={cn(
        "min-w-0 max-w-[46vw] sm:max-w-[240px]",
        align === "right" ? "text-right" : "text-left",
        className,
      )}
    >
      <p
        className={cn(
          "text-sm font-semibold leading-snug sm:text-base",
          status === "locked" && "text-muted-foreground",
        )}
      >
        {title}
      </p>
      {description ? (
        <p className="text-xs leading-snug text-muted-foreground">{description}</p>
      ) : null}
      {score ? (
        <p className="mt-0.5 text-xs font-medium tabular-nums text-success">{score}</p>
      ) : null}
    </div>
  );
}

export function CurrentLessonIndicator({ label }: { label: string }) {
  return (
    <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-primary/30 bg-card px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary shadow-soft">
      {label}
    </span>
  );
}
