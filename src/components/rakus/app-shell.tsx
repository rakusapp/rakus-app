import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  Crown,
  GraduationCap,
  Heart,
  Layers,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";

import { useProgress } from "@/state/progress";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Aprender", icon: GraduationCap, exact: true },
  { to: "/revisar", label: "Revisar", icon: RotateCcw },
  { to: "/questoes", label: "Banco de Questões", short: "Questões", icon: Layers },
  { to: "/desempenho", label: "Desempenho", short: "Dados", icon: BarChart3 },
  { to: "/missoes", label: "Missões", icon: Target },
  { to: "/ranking", label: "Ranking", icon: Trophy, desktopOnly: true },
  { to: "/pro", label: "Rakus Pro", icon: Crown, desktopOnly: true },
] as const;

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("inline-flex items-center gap-2", className)}>
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
        <Sparkles className="size-4" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-lg font-semibold tracking-tight">Rakus</span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Medicina
        </span>
      </span>
    </Link>
  );
}

export function StatsBar({ className }: { className?: string }) {
  const { progress } = useProgress();
  const stats = [
    { icon: Heart, value: String(progress.hearts), tone: "text-destructive", label: "Vidas" },
    { icon: Zap, value: `${progress.streakDays} dias`, tone: "text-gold", label: "Sequência" },
    { icon: Sparkles, value: `${progress.xp.toLocaleString("pt-BR")} XP`, tone: "text-primary", label: "Experiência" },
  ];
  return (
    <div className={cn("flex items-center gap-2 sm:gap-3", className)}>
      {stats.map((s) => (
        <div
          key={s.label}
          title={s.label}
          className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1.5 text-xs font-semibold shadow-soft sm:px-3 sm:text-sm"
        >
          <s.icon className={cn("size-4", s.tone)} />
          <span className="tabular-nums">{s.value}</span>
        </div>
      ))}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
        <Wordmark />
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: "exact" in item ? item.exact : false }}
              activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
              inactiveProps={{ className: "text-muted-foreground hover:bg-sidebar-accent/60" }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
            >
              <item.icon className="size-[18px]" />
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          Medicina, uma questão de cada vez.
        </p>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
            <Wordmark className="lg:hidden" />
            <span className="hidden text-sm font-medium text-muted-foreground lg:inline">
              Medicina Intensiva
            </span>
            <StatsBar />
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 pb-28 pt-6 lg:pb-16">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg items-stretch justify-between px-2 py-1.5">
          {navItems
            .filter((i) => !("desktopOnly" in i && i.desktopOnly))
            .map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: "exact" in item ? item.exact : false }}
                activeProps={{ className: "text-primary" }}
                inactiveProps={{ className: "text-muted-foreground" }}
                className="flex flex-1 flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-[10px] font-medium transition-colors"
              >
                <item.icon className="size-5" />
                {"short" in item ? item.short : item.label}
              </Link>
            ))}
        </div>
      </nav>
    </div>
  );
}
