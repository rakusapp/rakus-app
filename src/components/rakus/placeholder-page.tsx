import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

import { AppShell } from "@/components/rakus/app-shell";
import { Button } from "@/components/ui/button";

interface PlaceholderPageProps {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
}

export function PlaceholderPage({ icon: Icon, title, description, bullets }: PlaceholderPageProps) {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl animate-rise">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Icon className="size-6" />
          </span>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          <span className="mt-5 inline-flex rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-gold-foreground">
            Em breve
          </span>
          <ul className="mt-6 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex gap-3 text-sm text-muted-foreground">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                {b}
              </li>
            ))}
          </ul>
          <Button asChild className="mt-8 rounded-xl">
            <Link to="/">Voltar para a trilha</Link>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
