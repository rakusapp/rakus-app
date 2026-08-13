# Rakus — MVP da experiência de aprendizado médico

Plataforma gamificada de medicina: trilha vertical, micro-lições, questões clínicas, feedback imediato, XP e progressão. Conteúdo inicial: Medicina Intensiva → Choque (6 lições).

## Fluxo principal

```text
Trilha  →  Lição  →  Questão  →  Confirmar  →  Feedback + Pearl
   ^                                              |
   |                                              v
Próxima lição desbloqueada  <-  Resultado  <-  próxima questão
                                   |
                                   +-> Revisar erros
```

## Telas

1. **Aprender (/)** — cabeçalho com ❤️ vidas, 🔥 streak, ⚡ XP; card de resumo (percentual concluído, XP da semana, sequência, botão "Continuar estudando"); trilha vertical da unidade CHOQUE com 4 estados visuais (concluída, atual em destaque, disponível, bloqueada).
2. **Lição (/licao/$lessonId)** — uma questão por vez, barra de progresso, vidas; opções selecionáveis sem revelar resposta; botão **Confirmar**; painel de feedback (Correto! / Resposta incorreta) com explicação médica, motivo do erro e Pearl clínica; botão Continuar; animação sutil de +10 XP.
3. **Resultado** — "Lição concluída", acurácia (ex. 4/5 corretas), XP ganho (+90 XP), nome da lição, botões **Continuar** e **Revisar erros**.
4. **Revisar (/revisar)** — lista de questões erradas acumuladas, com opção de refazê-las no mesmo motor de lição.
5. **Placeholders polidos** — Banco de Questões, Desempenho, Missões, Ranking, Rakus Pro (estado "em breve" com layout consistente).

## Navegação

Sidebar fixa no desktop; bottom nav no mobile (Aprender, Revisar, Questões, Desempenho, Missões). Mobile é prioridade — layouts responsivos desde o início.

## Gamificação

+10 XP por acerto, +50 XP ao concluir a lição. Vidas apenas indicativas — nunca bloqueiam o estudo. Streak fixo em 12 dias nesta versão.

## Design

Branco/neutros suaves, tipografia forte, cards arredondados, sombras sutis, animações suaves. Acento clínico (verde musgo) com um secundário quente para conquistas — sem verde Duolingo, sem estética infantil. Logo tipográfico "Rakus" e mote "Medicina, uma questão de cada vez."

## Detalhes técnicos

- Tipos em `src/types/learning.ts`: `Specialty`, `Unit`, `Lesson`, `Challenge` (com `type: 'multipleChoice' | 'trueFalse' | 'clinicalCase' | 'image' | 'ordering' | 'flashcard' | 'matching' | 'aiConversation'`), `ChallengeOption`, `UserProgress`, `ChallengeProgress` — modelados como entidades prontas para PostgreSQL (ids, chaves estrangeiras).
- Conteúdo em `src/data/` (specialties, units, lessons, challenges), totalmente separado dos componentes. ~5 questões por lição.
- Renderização de questões via um dispatcher por `type`, com apenas `multipleChoice` implementado agora — os demais tipos entram sem refatoração.
- Estado de progresso num store/context (`src/state/progress`) com persistência em localStorage, mantendo histórico de erros para a futura repetição espaçada e futura troca por Lovable Cloud.
- Rotas TanStack: `index`, `licao.$lessonId`, `revisar`, mais os placeholders; cada rota com `head()` próprio (título/descrição/OG).
- Sem pagamentos, autenticação, IA, social ou admin.