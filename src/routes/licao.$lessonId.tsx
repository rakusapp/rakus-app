import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { LessonResult } from "@/components/rakus/lesson-result";
import { LessonRunner, type LessonRunnerResult } from "@/components/rakus/lesson-runner";
import { Button } from "@/components/ui/button";
import { getChallengesByLesson } from "@/data/challenges";
import { lessons } from "@/data/lessons";
import { units } from "@/data/specialties";
import { useProgress, XP_LESSON_BONUS, XP_PER_CORRECT } from "@/state/progress";

export const Route = createFileRoute("/licao/$lessonId")({
  head: () => ({
    meta: [
      { title: "Lição — Rakus" },
      {
        name: "description",
        content: "Questões clínicas com feedback imediato, explicação médica e pearl clínica.",
      },
      { property: "og:title", content: "Lição — Rakus" },
      {
        property: "og:description",
        content: "Responda questões clínicas e receba explicação médica imediata.",
      },
    ],
  }),
  component: LessonPage,
});

function LessonPage() {
  const { lessonId } = Route.useParams();
  const navigate = useNavigate();
  const { completeLesson } = useProgress();
  const [result, setResult] = useState<LessonRunnerResult | null>(null);
  const [reviewing, setReviewing] = useState(false);

  const lesson = lessons.find((l) => l.id === lessonId);
  const unit = units.find((u) => u.id === lesson?.unitId);
  const challenges = lesson ? getChallengesByLesson(lesson.id) : [];

  if (!lesson || challenges.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div>
          <h1 className="text-xl font-semibold">Lição não encontrada</h1>
          <Button asChild className="mt-4 rounded-xl">
            <Link to="/">Voltar para a trilha</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (reviewing && result) {
    const wrongIds = new Set(result.attempts.filter((a) => !a.isCorrect).map((a) => a.challengeId));
    const wrongChallenges = challenges.filter((c) => wrongIds.has(c.id));
    return (
      <LessonRunner
        key="review"
        title="Revisão de erros"
        subtitle={lesson.title}
        challenges={wrongChallenges}
        exitTo="/"
        onFinish={() => navigate({ to: "/" })}
      />
    );
  }

  if (result) {
    return (
      <LessonResult
        lessonTitle={lesson.title}
        correct={result.correct}
        total={result.total}
        xpEarned={result.correct * XP_PER_CORRECT + XP_LESSON_BONUS}
        hasMistakes={result.correct < result.total}
        onReviewMistakes={() => setReviewing(true)}
        onContinue={() => navigate({ to: "/" })}
      />
    );
  }

  return (
    <LessonRunner
      title={lesson.title}
      subtitle={unit?.title ?? "Rakus"}
      challenges={challenges}
      exitTo="/"
      onFinish={(r) => {
        completeLesson({ lessonId: lesson.id, correct: r.correct, total: r.total, attempts: r.attempts });
        setResult(r);
      }}
    />
  );
}
