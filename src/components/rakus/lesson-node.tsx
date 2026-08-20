import { Check, Lock, Play, Stethoscope } from "lucide-react";

import { cn } from "@/lib/utils";
import type { LessonStatus } from "@/types/learning";

interface LessonNodeProps {
  status: LessonStatus;
  progressPercentage?: number;
  className?: string;
}

const stateStyles: Record<LessonStatus, string> = {
  completed: "bg-success text-success-foreground border-b-4 border-success/45",
  current: "bg-primary text-primary-foreground border-b-4 border-primary/45",
  available:
    "bg-primary-soft text-primary border-2 border-primary/35 border-b-4 border-b-primary/35",
  locked: "bg-muted text-muted-foreground/70 border-b-4 border-border",
};

const icons: Record<LessonStatus, typeof Check> = {
  completed: Check,
  current: Play,
  available: Stethoscope,
  locked: Lock,
};

/** Circular, tactile lesson node with four visual states. */
export function LessonNode({ status, progressPercentage = 0, className }: LessonNodeProps) {
  const Icon = icons[status];
  const showRing = status === "current" && progressPercentage > 0;

  return (
    <span className={cn("relative inline-flex items-center justify-center", className)}>
      {status === "current" ? (
        <span className="absolute inset-[-6px] animate-pulse rounded-full bg-primary/15" />
      ) : null}

      {showRing ? (
        <span
          aria-hidden
          className="absolute inset-[-7px] rounded-full"
          style={{
            background: `conic-gradient(var(--primary) ${progressPercentage * 3.6}deg, color-mix(in oklab, var(--primary) 18%, transparent) 0deg)`,
            mask: "radial-gradient(circle, transparent 62%, #000 64%)",
            WebkitMask: "radial-gradient(circle, transparent 62%, #000 64%)",
          }}
        />
      ) : null}

      <span
        className={cn(
          "relative flex size-[58px] items-center justify-center rounded-full shadow-soft transition-transform duration-200 sm:size-[68px]",
          status !== "locked" && "group-hover:-translate-y-0.5 group-active:translate-y-[2px]",
          stateStyles[status],
        )}
      >
        <Icon className={cn("size-6 sm:size-7", status === "locked" && "size-5 sm:size-6")} />
      </span>
    </span>
  );
}
