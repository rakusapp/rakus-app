# Rakus: Medical Learning Path

Build a functional MVP prototype of a medical learning platform called Rakus.



Rakus should feel like a Duolingo-inspired learning experience for Medicine, focused on short lessons, questions, immediate feedback, progression and gamification.



Use this open-source project as a functional and UX reference:



https://github.com/sanidhyy/duolingo-clone



Do NOT simply reproduce the repository or blindly copy its visual identity. Study the concepts behind its learning path, lessons, challenges, user progress, XP, hearts, quests and navigation, and adapt them to medical education.



PRIMARY GOAL



I want to validate the core Rakus learning experience as quickly as possible.



For this first version, prioritize:



Learning path

Medical micro-lessons

Multiple-choice clinical questions

Immediate answer feedback

XP and progress

Lesson completion

Review of mistakes



Do NOT prioritize payments, Stripe, advanced authentication, AI generation, social features or a complex admin panel yet.



The prototype should already feel like a real product, not just static mockups.



⸻



PRODUCT CONCEPT



Rakus teaches Medicine through short, gamified learning sessions.



The content hierarchy should be:



Specialty

→ Topic

→ Lesson

→ Challenge / Question



Example:



Medicina Intensiva

→ Choque

→ Choque Hipovolêmico

→ Clinical questions



The user progresses through a vertical learning path similar in concept to Duolingo.



Completed lessons should be visually distinct from:



current lesson

available lessons

locked lessons



⸻



INITIAL DEMO CONTENT



Create one initial specialty:



Medicina Intensiva



Create a unit:



Choque



Inside it create these lessons:



Reconhecimento do choque

Índice de choque

Choque hipovolêmico

Choque distributivo

Choque cardiogênico

Choque obstrutivo



Some lessons should initially appear locked so we can demonstrate progression.



⸻



MAIN LEARNING SCREEN



The main screen should show a vertical learning path.



Example:



Medicina Intensiva



CHOQUE



✓ Reconhecimento do choque



✓ Índice de choque



● Choque hipovolêmico



○ Choque distributivo



🔒 Choque cardiogênico



🔒 Choque obstrutivo



The current lesson should be visually emphasized.



Selecting an available lesson starts that lesson.



⸻



LESSON EXPERIENCE



A lesson should contain approximately 5 questions.



Show ONE question at a time.



Example clinical question:



“Paciente de 68 anos chega após episódio de hematêmese volumosa.



PA: 82/46 mmHg

FC: 128 bpm

TEC: 5 segundos

Lactato: 6 mmol/L



Qual é o diagnóstico mais provável?”



Answers:



A. Choque cardiogênico

B. Choque hipovolêmico

C. Choque neurogênico

D. Choque obstrutivo



The user selects one answer and presses:



Confirmar



Do not reveal the correct answer before confirmation.



⸻



ANSWER FEEDBACK



After answering, display an immediate feedback panel.



If correct:



Correto!



Then provide a concise medical explanation.



Example:



“O quadro é compatível com choque hipovolêmico hemorrágico. A combinação de hipotensão, taquicardia, prolongamento do tempo de enchimento capilar e hiperlactatemia sugere hipoperfusão sistêmica.”



Also show a short:



Pearl clínica



Example:



“Um índice de choque >0,9 deve aumentar a suspeita de instabilidade hemodinâmica.”



If incorrect:



Show:



Resposta incorreta



Then:



correct answer

why it is correct

short explanation of why the selected answer is wrong



Then allow the student to continue.



⸻



QUESTION ARCHITECTURE



Even though the MVP initially uses multiple-choice questions, structure the application so a challenge can later support different types:



multiple choice

true / false

clinical case

image-based question

ordering steps

flashcard

matching

AI conversation



Do not hardcode the system assuming every challenge will always be multiple choice.



Conceptually use something like:



Challenge



id

type

question

explanation

clinicalPearl

difficulty

specialty

topic

lesson

options

correctAnswer



⸻



GAMIFICATION



At the top of the application show:



❤️ Hearts



🔥 Study streak



⚡ XP



Example:



❤️ 5   🔥 12 dias   ⚡ 2.450 XP



Correct answers should award XP.



For the prototype:



Correct answer = +10 XP



Lesson completed = +50 XP bonus



Display subtle animation or feedback when XP is gained.



Do NOT make hearts block access to learning in this MVP.



Hearts are only a gamification indicator for now.



⸻



LESSON COMPLETION



After completing a lesson show a result screen:



Lição concluída



Include:



Accuracy



Example:



4 / 5 corretas



XP earned



Example:



+90 XP



Show:



“Você concluiu Choque Hipovolêmico”



Buttons:



Continuar



Revisar erros



⸻



REVIEW MODE



If the student answered questions incorrectly, allow:



Revisar erros



Show only the questions the student got wrong.



This will later become a spaced repetition system, so design the architecture so mistake history can eventually be stored.



⸻



SIDEBAR / NAVIGATION



Desktop navigation:



Aprender



Revisar



Banco de Questões



Desempenho



Missões



Ranking



Rakus Pro



For this MVP, only Aprender and Revisar need to be fully functional.



The other pages can exist as polished placeholders.



On mobile use bottom navigation instead of a permanent sidebar.



⸻



DASHBOARD



Besides the learning path, show a small progress summary.



Example:



Medicina Intensiva



32% concluído



XP esta semana: 620



Sequência: 12 dias



Also show:



Continuar estudando



Choque Hipovolêmico



⸻



DESIGN DIRECTION



The interface should feel:



modern

premium

medical

approachable

highly polished

gamified without looking childish



Do NOT visually clone Duolingo.



Avoid excessive green and avoid making it look like a children’s educational application.



Use:



clean white or subtle neutral backgrounds

strong typography

rounded cards

subtle shadows

smooth animations

good spacing

premium dashboard aesthetics



The interface should feel closer to a modern healthcare / technology product combined with the engagement mechanics of Duolingo.



Use icons where useful, but avoid excessive decorative emojis.



Mobile experience is extremely important.



⸻



BRAND



Product name:



Rakus



Possible positioning:



Medicina, uma questão de cada vez.



The logo can initially be a simple typographic Rakus logo.



Do not spend excessive implementation time on branding during this first iteration.



⸻



TECHNICAL REQUIREMENTS



Use the standard Lovable stack and reusable components.



Keep content separated from presentation logic.



Do NOT put all lesson content directly inside React components.



Create structured mock data or database-ready entities for:



Specialties



Topics / Units



Lessons



Challenges



Challenge Options



User Progress



Challenge Progress



This should make it easy to connect Supabase or another PostgreSQL backend later.



Use TypeScript types/interfaces for the learning entities.



Build responsive layouts from the beginning.



⸻



IMPORTANT PRODUCT DECISIONS



Do not recreate the entire Duolingo clone.



Do not implement Stripe yet.



Do not build Rakus Pro yet.



Do not build a complex admin system yet.



Do not integrate an LLM yet.



Do not build social features yet.



Do not over-engineer authentication.



The objective of this iteration is to prove that the core medical-learning loop is engaging.



The most important flow is:



Learning path

→ lesson

→ question

→ answer

→ medical explanation

→ XP

→ next question

→ lesson completed

→ progression unlocked.



⸻



MVP SUCCESS CRITERIA



At the end of this build I must be able to:



Open Rakus.

See the Medicina Intensiva learning path.

Select an available lesson.

Answer medical questions.

Receive correct/incorrect feedback.

Read the explanation.

Gain XP.

Complete the lesson.

See my score.

Review incorrect questions.

Return to the learning path.

See the next lesson unlocked.



Build this complete flow first before expanding the product.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://clinic-quiz-pro.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/dc1b2dcd-20dc-43a2-b394-30dee099a5f3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
