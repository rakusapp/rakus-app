import type { Challenge, ChallengeOption, Difficulty } from "@/types/learning";

type RawOption = {
  text: string;
  correct?: boolean;
  rationale?: string;
};

type RawChallenge = {
  id: string;
  lessonId: string;
  difficulty: Difficulty;
  vignette?: string;
  vitals?: { label: string; value: string }[];
  question: string;
  explanation: string;
  clinicalPearl?: string;
  options: RawOption[];
};

const LABELS = ["A", "B", "C", "D", "E"];

function build(raw: RawChallenge[]): Challenge[] {
  const byLesson: Record<string, number> = {};
  return raw.map((c) => {
    byLesson[c.lessonId] = (byLesson[c.lessonId] ?? 0) + 1;
    const options: ChallengeOption[] = c.options.map((o, i) => ({
      id: `${c.id}-${LABELS[i].toLowerCase()}`,
      challengeId: c.id,
      label: LABELS[i],
      text: o.text,
      isCorrect: Boolean(o.correct),
      rationale: o.rationale,
    }));
    return {
      id: c.id,
      lessonId: c.lessonId,
      type: "multipleChoice",
      order: byLesson[c.lessonId],
      difficulty: c.difficulty,
      vignette: c.vignette,
      vitals: c.vitals,
      question: c.question,
      explanation: c.explanation,
      clinicalPearl: c.clinicalPearl,
      options,
    } satisfies Challenge;
  });
}

export const challenges: Challenge[] = build([
  // ----------------------------- Reconhecimento do choque
  {
    id: "rc-1",
    lessonId: "reconhecimento-do-choque",
    difficulty: "facil",
    question: "Qual é a definição fisiopatológica mais precisa de choque?",
    explanation:
      "Choque é um estado de hipoperfusão tecidual aguda com oferta de oxigênio insuficiente para a demanda celular, levando a metabolismo anaeróbio. A hipotensão pode estar ausente nas fases iniciais.",
    clinicalPearl: "Choque é diagnóstico de perfusão, não de pressão arterial.",
    options: [
      {
        text: "Pressão arterial sistólica menor que 90 mmHg",
        rationale: "Hipotensão é um sinal frequente, porém tardio e não obrigatório.",
      },
      { text: "Hipoperfusão tecidual com oferta de O2 insuficiente à demanda celular", correct: true },
      {
        text: "Queda do débito cardíaco abaixo de 4 L/min",
        rationale: "No choque distributivo o débito costuma estar alto.",
      },
      {
        text: "Lactato acima de 2 mmol/L isoladamente",
        rationale: "Hiperlactatemia apoia o diagnóstico, mas tem outras causas (ex.: beta-agonistas).",
      },
    ],
  },
  {
    id: "rc-2",
    lessonId: "reconhecimento-do-choque",
    difficulty: "media",
    vignette:
      "Homem de 54 anos com quadro febril há 3 dias. Está lúcido, porém taquipneico, com extremidades quentes.",
    vitals: [
      { label: "PA", value: "104/48 mmHg" },
      { label: "FC", value: "118 bpm" },
      { label: "Lactato", value: "3,4 mmol/L" },
      { label: "Diurese", value: "0,3 mL/kg/h" },
    ],
    question: "Qual achado melhor indica hipoperfusão já instalada?",
    explanation:
      "A oligúria (<0,5 mL/kg/h) associada à hiperlactatemia demonstra hipoperfusão de órgão-alvo, mesmo com PA sistólica ainda acima de 90 mmHg.",
    clinicalPearl: "Diurese, nível de consciência e pele são os três 'janelas' clínicas de perfusão.",
    options: [
      { text: "Extremidades quentes", rationale: "Sugere vasodilatação, mas isoladamente não indica hipoperfusão." },
      { text: "Frequência respiratória elevada", rationale: "Inespecífica: pode refletir apenas febre ou dor." },
      { text: "Oligúria com lactato de 3,4 mmol/L", correct: true },
      { text: "Pressão sistólica de 104 mmHg", rationale: "Está dentro da faixa normal e não caracteriza choque." },
    ],
  },
  {
    id: "rc-3",
    lessonId: "reconhecimento-do-choque",
    difficulty: "media",
    question: "Qual valor de tempo de enchimento capilar (TEC) é considerado alterado em adultos?",
    explanation:
      "TEC maior que 3 segundos indica má perfusão periférica e associa-se a pior prognóstico. É medido na polpa digital com pressão firme por 15 segundos.",
    clinicalPearl: "O TEC normaliza antes do lactato e é útil para guiar a resposta à ressuscitação.",
    options: [
      { text: "> 1 segundo", rationale: "Valor fisiológico normal." },
      { text: "> 2 segundos", rationale: "Limítrofe; o ponto de corte prognóstico usual é 3 segundos." },
      { text: "> 3 segundos", correct: true },
      { text: "> 6 segundos", rationale: "Já representa hipoperfusão grave, não o limiar de alteração." },
    ],
  },
  {
    id: "rc-4",
    lessonId: "reconhecimento-do-choque",
    difficulty: "dificil",
    question: "Em qual situação a pressão arterial pode permanecer normal apesar de choque instalado?",
    explanation:
      "Na fase compensada, a vasoconstrição mediada por catecolaminas mantém a PA às custas de aumento da resistência vascular, enquanto a perfusão tecidual já está comprometida — o chamado choque críptico.",
    clinicalPearl: "Jovens e hipertensos crônicos mascaram o choque: valorize lactato e perfusão periférica.",
    options: [
      { text: "Choque compensado por vasoconstrição adrenérgica", correct: true },
      { text: "Choque refratário a vasopressores", rationale: "Nessa fase a hipotensão é a regra." },
      { text: "Parada cardíaca iminente", rationale: "Há hipotensão profunda ou ausência de pulso." },
      { text: "Choque distributivo tardio", rationale: "Predomina hipotensão por vasoplegia mantida." },
    ],
  },
  {
    id: "rc-5",
    lessonId: "reconhecimento-do-choque",
    difficulty: "media",
    question: "Qual conjunto de perfis descreve corretamente os quatro tipos clássicos de choque?",
    explanation:
      "Os quatro mecanismos clássicos são hipovolêmico, cardiogênico, distributivo e obstrutivo. Diferenciá-los orienta a terapia: volume, inotrópico, vasopressor ou desobstrução.",
    clinicalPearl: "Perfil quente e vasodilatado = distributivo; frio e congesto = cardiogênico.",
    options: [
      { text: "Hipovolêmico, cardiogênico, distributivo e obstrutivo", correct: true },
      { text: "Séptico, anafilático, neurogênico e hemorrágico", rationale: "São causas, não os mecanismos-base." },
      { text: "Compensado, descompensado, refratário e irreversível", rationale: "Descreve fases, não tipos." },
      { text: "Quente, frio, misto e críptico", rationale: "São descrições clínicas, não a classificação clássica." },
    ],
  },

  // ----------------------------- Índice de choque
  {
    id: "ic-1",
    lessonId: "indice-de-choque",
    difficulty: "facil",
    question: "Como se calcula o índice de choque?",
    explanation:
      "Índice de choque = frequência cardíaca dividida pela pressão arterial sistólica. O valor normal fica entre 0,5 e 0,7.",
    clinicalPearl: "É uma conta de beira de leito: não exige exame nenhum.",
    options: [
      { text: "FC ÷ PAS", correct: true },
      { text: "PAS ÷ FC", rationale: "Inverte a fórmula e gera valores que caem no choque." },
      { text: "PAM ÷ FC", rationale: "Usa a pressão média, não é a definição." },
      { text: "FC × PAS ÷ 100", rationale: "Não corresponde a nenhum índice validado." },
    ],
  },
  {
    id: "ic-2",
    lessonId: "indice-de-choque",
    difficulty: "media",
    vitals: [
      { label: "PA", value: "96/60 mmHg" },
      { label: "FC", value: "115 bpm" },
    ],
    question: "Qual é o índice de choque deste paciente e como interpretá-lo?",
    explanation:
      "115 ÷ 96 ≈ 1,2. Valores acima de 0,9 sugerem instabilidade hemodinâmica oculta, e acima de 1,0 associam-se a maior necessidade de transfusão e mortalidade.",
    clinicalPearl: "Um índice de choque >0,9 deve aumentar a suspeita de instabilidade hemodinâmica.",
    options: [
      { text: "≈ 0,8 — normal", rationale: "Cálculo incorreto; o valor é maior que 1." },
      { text: "≈ 1,2 — sugere instabilidade hemodinâmica", correct: true },
      { text: "≈ 1,2 — sem significado se a PAS estiver acima de 90", rationale: "O índice alerta justamente antes da hipotensão franca." },
      { text: "≈ 0,6 — perfusão adequada", rationale: "Corresponderia a FC baixa com PAS normal." },
    ],
  },
  {
    id: "ic-3",
    lessonId: "indice-de-choque",
    difficulty: "media",
    question: "Em qual paciente o índice de choque tende a ser MENOS confiável?",
    explanation:
      "Pacientes em uso de betabloqueador não desenvolvem taquicardia compensatória, o que subestima o índice de choque mesmo diante de perda volêmica significativa.",
    clinicalPearl: "Betabloqueador, marca-passo e idosos mascaram a taquicardia do choque.",
    options: [
      { text: "Jovem hígido com trauma abdominal", rationale: "É o cenário em que o índice funciona melhor." },
      { text: "Paciente em uso crônico de betabloqueador", correct: true },
      { text: "Gestante no terceiro trimestre", rationale: "Há ajuste de valores, mas o índice segue útil." },
      { text: "Paciente com sepse de foco urinário", rationale: "O índice também tem valor prognóstico na sepse." },
    ],
  },
  {
    id: "ic-4",
    lessonId: "indice-de-choque",
    difficulty: "dificil",
    vignette: "Vítima de acidente automobilístico, consciente, sem hipotensão à admissão.",
    vitals: [
      { label: "PA", value: "118/72 mmHg" },
      { label: "FC", value: "124 bpm" },
      { label: "Hb", value: "11,8 g/dL" },
    ],
    question: "Qual é a conduta mais adequada diante desses dados?",
    explanation:
      "O índice de choque é 124/118 ≈ 1,05, elevado apesar da PA normal. Isso identifica sangramento oculto e indica investigação com FAST/tomografia e preparo para transfusão.",
    clinicalPearl: "Hemoglobina inicial normal não exclui hemorragia aguda: a hemodiluição leva horas.",
    options: [
      { text: "Alta com orientação, pois a PA está normal", rationale: "Ignora o índice elevado e o risco de sangramento oculto." },
      { text: "Investigar sangramento oculto e acionar protocolo de hemotransfusão", correct: true },
      { text: "Iniciar noradrenalina imediatamente", rationale: "No choque hemorrágico o vasopressor precede o controle do sangramento apenas em exceções." },
      { text: "Repetir hemograma em 12 horas antes de qualquer conduta", rationale: "Atrasa perigosamente o diagnóstico." },
    ],
  },
  {
    id: "ic-5",
    lessonId: "indice-de-choque",
    difficulty: "facil",
    question: "Qual é a faixa considerada normal para o índice de choque em adultos?",
    explanation:
      "A faixa normal é 0,5 a 0,7. Valores progressivamente maiores indicam desequilíbrio entre volume circulante e tônus cardiovascular.",
    options: [
      { text: "0,1 a 0,3", rationale: "Valor irreal para fisiologia humana." },
      { text: "0,5 a 0,7", correct: true },
      { text: "0,9 a 1,1", rationale: "Já é a faixa de alerta." },
      { text: "1,2 a 1,5", rationale: "Indica choque estabelecido." },
    ],
  },

  // ----------------------------- Choque hipovolêmico
  {
    id: "hv-1",
    lessonId: "choque-hipovolemico",
    difficulty: "media",
    vignette: "Paciente de 68 anos chega após episódio de hematêmese volumosa.",
    vitals: [
      { label: "PA", value: "82/46 mmHg" },
      { label: "FC", value: "128 bpm" },
      { label: "TEC", value: "5 segundos" },
      { label: "Lactato", value: "6 mmol/L" },
    ],
    question: "Qual é o diagnóstico mais provável?",
    explanation:
      "O quadro é compatível com choque hipovolêmico hemorrágico. A combinação de hipotensão, taquicardia, prolongamento do tempo de enchimento capilar e hiperlactatemia sugere hipoperfusão sistêmica por perda volêmica aguda.",
    clinicalPearl: "Um índice de choque >0,9 deve aumentar a suspeita de instabilidade hemodinâmica.",
    options: [
      { text: "Choque cardiogênico", rationale: "Esperaria-se congestão pulmonar e sinais de falência de bomba, ausentes aqui." },
      { text: "Choque hipovolêmico", correct: true },
      { text: "Choque neurogênico", rationale: "Cursa com bradicardia e pele quente, além de exigir lesão medular." },
      { text: "Choque obstrutivo", rationale: "Exigiria turgência jugular e causa mecânica como tamponamento ou TEP." },
    ],
  },
  {
    id: "hv-2",
    lessonId: "choque-hipovolemico",
    difficulty: "media",
    question: "Qual é a primeira medida no choque hemorrágico com sangramento ativo?",
    explanation:
      "A prioridade é o controle da fonte de sangramento associado à reposição com hemocomponentes. Cristaloide em grande volume piora coagulopatia, acidose e hipotermia.",
    clinicalPearl: "Tríade letal do trauma: hipotermia, acidose e coagulopatia.",
    options: [
      { text: "Infundir 3 litros de cristaloide antes de qualquer intervenção", rationale: "Agrava a coagulopatia dilucional." },
      { text: "Controle da fonte de sangramento com transfusão balanceada", correct: true },
      { text: "Iniciar dobutamina", rationale: "Inotrópico não corrige perda volêmica." },
      { text: "Aguardar tomografia antes de qualquer reposição", rationale: "Instabilidade contraindica transporte para exame antes da estabilização." },
    ],
  },
  {
    id: "hv-3",
    lessonId: "choque-hipovolemico",
    difficulty: "dificil",
    question: "Qual perfil hemodinâmico é esperado no choque hipovolêmico?",
    explanation:
      "Há redução da pré-carga (PVC/POAP baixas), queda do débito cardíaco e aumento compensatório da resistência vascular sistêmica.",
    clinicalPearl: "Hipovolêmico e cardiogênico compartilham DC baixo e RVS alta; a pré-carga os separa.",
    options: [
      { text: "Pré-carga baixa, débito baixo, resistência vascular alta", correct: true },
      { text: "Pré-carga alta, débito baixo, resistência alta", rationale: "É o padrão do choque cardiogênico." },
      { text: "Pré-carga baixa, débito alto, resistência baixa", rationale: "Corresponde ao choque distributivo." },
      { text: "Pré-carga alta, débito baixo, resistência baixa", rationale: "Não corresponde a um perfil clássico." },
    ],
  },
  {
    id: "hv-4",
    lessonId: "choque-hipovolemico",
    difficulty: "media",
    question: "Perda de aproximadamente 30% da volemia corresponde a qual classe de choque hemorrágico?",
    explanation:
      "Classe III (30–40% de perda) cursa com hipotensão franca, taquicardia acima de 120 bpm, taquipneia e queda da diurese — geralmente indica transfusão.",
    options: [
      { text: "Classe I", rationale: "Até 15%, com sinais vitais praticamente normais." },
      { text: "Classe II", rationale: "15–30%, com taquicardia e pressão de pulso estreita, mas PAS mantida." },
      { text: "Classe III", correct: true },
      { text: "Classe IV", rationale: "Acima de 40%, com risco imediato de parada." },
    ],
  },
  {
    id: "hv-5",
    lessonId: "choque-hipovolemico",
    difficulty: "facil",
    question: "Qual sinal sugere resposta adequada à ressuscitação volêmica?",
    explanation:
      "Melhora do tempo de enchimento capilar, aumento da diurese, queda progressiva do lactato e melhora do nível de consciência indicam restauração da perfusão.",
    clinicalPearl: "Clareamento do lactato >10–20% em 2 horas é uma boa meta de ressuscitação.",
    options: [
      { text: "Aumento isolado da pressão arterial diastólica", rationale: "Pode refletir apenas vasoconstrição." },
      { text: "Queda progressiva do lactato com aumento da diurese", correct: true },
      { text: "Elevação da frequência cardíaca", rationale: "Sugere hipovolemia persistente." },
      { text: "Redução da temperatura das extremidades", rationale: "Indica piora da perfusão periférica." },
    ],
  },

  // ----------------------------- Choque distributivo
  {
    id: "ds-1",
    lessonId: "choque-distributivo",
    difficulty: "facil",
    question: "Qual é a alteração hemodinâmica central do choque distributivo?",
    explanation:
      "Predomina a vasoplegia: queda acentuada da resistência vascular sistêmica, com débito cardíaco normal ou elevado nas fases iniciais.",
    clinicalPearl: "Extremidades quentes com hipotensão sugerem vasoplegia até prova em contrário.",
    options: [
      { text: "Queda da resistência vascular sistêmica", correct: true },
      { text: "Queda importante da pré-carga por perda externa", rationale: "É o mecanismo do choque hipovolêmico." },
      { text: "Falência contrátil do ventrículo esquerdo", rationale: "Define o choque cardiogênico." },
      { text: "Obstrução ao fluxo de saída do ventrículo direito", rationale: "Descreve o choque obstrutivo." },
    ],
  },
  {
    id: "ds-2",
    lessonId: "choque-distributivo",
    difficulty: "media",
    vignette: "Mulher de 32 anos, minutos após antibiótico endovenoso, com urticária difusa e estridor.",
    vitals: [
      { label: "PA", value: "74/40 mmHg" },
      { label: "FC", value: "132 bpm" },
      { label: "SpO2", value: "89%" },
    ],
    question: "Qual é a conduta inicial correta?",
    explanation:
      "Anafilaxia exige adrenalina intramuscular 0,5 mg na face anterolateral da coxa, imediatamente, antes de corticoide ou anti-histamínico.",
    clinicalPearl: "Atraso na adrenalina IM é o principal fator associado a óbito por anafilaxia.",
    options: [
      { text: "Hidrocortisona endovenosa isolada", rationale: "Tem início de ação lento e não reverte a obstrução aguda." },
      { text: "Adrenalina intramuscular 0,5 mg na coxa", correct: true },
      { text: "Difenidramina endovenosa como primeira medida", rationale: "Alivia prurido, mas não trata o choque." },
      { text: "Noradrenalina em bomba antes de qualquer outra medida", rationale: "Pode ser necessária depois, mas não substitui a adrenalina IM inicial." },
    ],
  },
  {
    id: "ds-3",
    lessonId: "choque-distributivo",
    difficulty: "media",
    question: "Qual é o vasopressor de primeira escolha no choque séptico?",
    explanation:
      "A noradrenalina é o vasopressor de primeira linha, com alvo de PAM ≥ 65 mmHg, por melhor perfil de arritmias em comparação à dopamina.",
    options: [
      { text: "Dopamina", rationale: "Associa-se a mais arritmias e não é mais recomendada de rotina." },
      { text: "Noradrenalina", correct: true },
      { text: "Dobutamina", rationale: "É inotrópico, indicado se houver disfunção miocárdica associada." },
      { text: "Fenilefrina", rationale: "Reservada a situações específicas, como taquiarritmias limitantes." },
    ],
  },
  {
    id: "ds-4",
    lessonId: "choque-distributivo",
    difficulty: "dificil",
    question: "Qual achado diferencia o choque neurogênico dos demais distributivos?",
    explanation:
      "No choque neurogênico há perda do tônus simpático, resultando em hipotensão com bradicardia e pele quente e seca — enquanto sepse e anafilaxia cursam com taquicardia.",
    clinicalPearl: "Hipotensão + bradicardia após trauma raquimedular alto = choque neurogênico.",
    options: [
      { text: "Bradicardia associada à hipotensão", correct: true },
      { text: "Taquicardia intensa", rationale: "É a resposta esperada na sepse e na anafilaxia." },
      { text: "Extremidades frias e moteadas", rationale: "Sugere baixo débito, não vasoplegia neurogênica." },
      { text: "Turgência jugular importante", rationale: "Aponta para causa obstrutiva ou cardiogênica." },
    ],
  },
  {
    id: "ds-5",
    lessonId: "choque-distributivo",
    difficulty: "media",
    question: "Em choque séptico, em quanto tempo o antibiótico deve ser administrado?",
    explanation:
      "As diretrizes recomendam antibiótico de amplo espectro na primeira hora do reconhecimento do choque séptico, após coleta de culturas quando isso não atrasar o tratamento.",
    clinicalPearl: "Cada hora de atraso do antibiótico no choque séptico aumenta a mortalidade.",
    options: [
      { text: "Dentro de 1 hora", correct: true },
      { text: "Dentro de 6 horas", rationale: "Aceitável apenas para sepse sem choque em algumas leituras, não para choque." },
      { text: "Após o resultado das culturas", rationale: "Atrasa demais o tratamento." },
      { text: "Após estabilização completa da pressão", rationale: "Antibiótico e ressuscitação ocorrem em paralelo." },
    ],
  },

  // ----------------------------- Choque cardiogênico
  {
    id: "cg-1",
    lessonId: "choque-cardiogenico",
    difficulty: "media",
    vignette: "Homem de 71 anos com dor torácica há 4 horas, dispneico, com estertores bilaterais.",
    vitals: [
      { label: "PA", value: "80/50 mmHg" },
      { label: "FC", value: "108 bpm" },
      { label: "Extremidades", value: "frias" },
      { label: "ECG", value: "supra de ST anterior" },
    ],
    question: "Qual é o diagnóstico mais provável?",
    explanation:
      "Trata-se de choque cardiogênico por infarto anterior extenso: hipotensão, congestão pulmonar e má perfusão periférica — o clássico perfil 'frio e úmido'.",
    clinicalPearl: "Choque cardiogênico pós-IAM exige reperfusão imediata; é a medida que mais reduz mortalidade.",
    options: [
      { text: "Choque hipovolêmico", rationale: "Não haveria congestão pulmonar nem supra de ST." },
      { text: "Choque cardiogênico", correct: true },
      { text: "Choque séptico", rationale: "Cursa com extremidades quentes e vasoplegia." },
      { text: "Choque neurogênico", rationale: "Exige lesão medular e cursa com bradicardia." },
    ],
  },
  {
    id: "cg-2",
    lessonId: "choque-cardiogenico",
    difficulty: "media",
    question: "Qual perfil clínico de Stevenson corresponde ao choque cardiogênico típico?",
    explanation:
      "O perfil C ('frio e úmido') combina baixo débito (frio) com congestão (úmido), o padrão mais frequente do choque cardiogênico.",
    options: [
      { text: "Perfil A — quente e seco", rationale: "Paciente compensado." },
      { text: "Perfil B — quente e úmido", rationale: "Congesto, mas com perfusão preservada." },
      { text: "Perfil C — frio e úmido", correct: true },
      { text: "Perfil L — frio e seco", rationale: "Baixo débito sem congestão, menos comum." },
    ],
  },
  {
    id: "cg-3",
    lessonId: "choque-cardiogenico",
    difficulty: "dificil",
    question: "Qual droga é mais apropriada para o paciente com choque cardiogênico e PAM de 55 mmHg?",
    explanation:
      "Com hipotensão significativa, a noradrenalina é preferida para restaurar a pressão de perfusão coronariana; a dobutamina pode ser associada depois para suporte inotrópico.",
    clinicalPearl: "Sem pressão de perfusão coronariana não há como recuperar a bomba.",
    options: [
      { text: "Noradrenalina", correct: true },
      { text: "Dobutamina isolada", rationale: "Sua vasodilatação pode agravar a hipotensão nesse cenário." },
      { text: "Nitroglicerina", rationale: "Contraindicada em hipotensão." },
      { text: "Furosemida em bolus alto", rationale: "Pode piorar o débito antes de restaurar a perfusão." },
    ],
  },
  {
    id: "cg-4",
    lessonId: "choque-cardiogenico",
    difficulty: "media",
    question: "Qual exame à beira do leito é mais útil para confirmar disfunção de bomba?",
    explanation:
      "O ecocardiograma point-of-care avalia contratilidade, tamanho das câmaras, derrame pericárdico e função do VD, diferenciando rapidamente os tipos de choque.",
    options: [
      { text: "Ecocardiograma point-of-care", correct: true },
      { text: "Radiografia de tórax", rationale: "Mostra congestão, mas não avalia função ventricular." },
      { text: "Gasometria arterial", rationale: "Avalia consequências, não o mecanismo." },
      { text: "Troponina seriada", rationale: "Indica lesão miocárdica, sem medir função." },
    ],
  },
  {
    id: "cg-5",
    lessonId: "choque-cardiogenico",
    difficulty: "media",
    question: "Qual é a causa mais comum de choque cardiogênico?",
    explanation:
      "O infarto agudo do miocárdio com disfunção de ventrículo esquerdo responde pela maioria dos casos, seguido por complicações mecânicas e miocardites.",
    options: [
      { text: "Infarto agudo do miocárdio", correct: true },
      { text: "Miocardite viral", rationale: "Causa importante, porém bem menos frequente." },
      { text: "Valvopatia crônica compensada", rationale: "Raramente evolui de forma aguda para choque." },
      { text: "Taquicardia sinusal por febre", rationale: "Não causa falência de bomba isoladamente." },
    ],
  },

  // ----------------------------- Choque obstrutivo
  {
    id: "ob-1",
    lessonId: "choque-obstrutivo",
    difficulty: "media",
    vignette: "Paciente politraumatizado, dispneico, com desvio de traqueia e ausência de murmúrio à direita.",
    vitals: [
      { label: "PA", value: "78/44 mmHg" },
      { label: "FC", value: "136 bpm" },
      { label: "Jugulares", value: "túrgidas" },
    ],
    question: "Qual é a conduta imediata?",
    explanation:
      "O quadro é de pneumotórax hipertensivo. A descompressão torácica imediata (por punção ou toracostomia) precede qualquer exame de imagem.",
    clinicalPearl: "Pneumotórax hipertensivo é diagnóstico clínico: radiografia não deve atrasar a descompressão.",
    options: [
      { text: "Radiografia de tórax antes de qualquer intervenção", rationale: "Atrasa uma conduta que salva vida." },
      { text: "Descompressão torácica imediata", correct: true },
      { text: "Infundir 2 litros de cristaloide e reavaliar", rationale: "Não resolve a obstrução mecânica ao retorno venoso." },
      { text: "Iniciar noradrenalina e observar", rationale: "Apenas mascara temporariamente a causa mecânica." },
    ],
  },
  {
    id: "ob-2",
    lessonId: "choque-obstrutivo",
    difficulty: "media",
    question: "Qual tríade sugere tamponamento cardíaco?",
    explanation:
      "A tríade de Beck reúne hipotensão, turgência jugular e abafamento de bulhas, decorrente da restrição ao enchimento diastólico.",
    clinicalPearl: "Pulso paradoxal >10 mmHg reforça a suspeita de tamponamento.",
    options: [
      { text: "Hipotensão, turgência jugular e bulhas abafadas", correct: true },
      { text: "Febre, sopro e esplenomegalia", rationale: "Sugere endocardite." },
      { text: "Dor torácica, sudorese e supra de ST", rationale: "Descreve síndrome coronariana aguda." },
      { text: "Bradicardia, hipotensão e pele quente", rationale: "Corresponde ao choque neurogênico." },
    ],
  },
  {
    id: "ob-3",
    lessonId: "choque-obstrutivo",
    difficulty: "dificil",
    question: "Qual achado ecocardiográfico sugere tromboembolismo pulmonar com repercussão hemodinâmica?",
    explanation:
      "Dilatação do ventrículo direito com relação VD/VE > 1 e desvio septal indicam sobrecarga aguda de VD, marcador de TEP de alto risco.",
    options: [
      { text: "Dilatação de ventrículo direito com relação VD/VE > 1", correct: true },
      { text: "Hipertrofia concêntrica de ventrículo esquerdo", rationale: "Sugere doença crônica, como hipertensão." },
      { text: "Fração de ejeção de VE de 65%", rationale: "É um valor normal e não explica o choque." },
      { text: "Veia cava inferior colabada", rationale: "Aponta para hipovolemia, não obstrução." },
    ],
  },
  {
    id: "ob-4",
    lessonId: "choque-obstrutivo",
    difficulty: "media",
    question: "Qual é o tratamento definitivo do TEP maciço com choque, na ausência de contraindicação?",
    explanation:
      "TEP de alto risco com instabilidade hemodinâmica tem indicação de trombólise sistêmica; alternativas são embolectomia cirúrgica ou por cateter.",
    options: [
      { text: "Trombólise sistêmica", correct: true },
      { text: "Anticoagulação plena isolada", rationale: "Insuficiente diante de choque estabelecido." },
      { text: "Apenas oxigenoterapia e observação", rationale: "Não trata a obstrução." },
      { text: "Filtro de veia cava como primeira medida", rationale: "Reservado a contraindicação à anticoagulação." },
    ],
  },
  {
    id: "ob-5",
    lessonId: "choque-obstrutivo",
    difficulty: "facil",
    question: "Qual mecanismo comum une as causas de choque obstrutivo?",
    explanation:
      "Todas provocam obstrução mecânica ao enchimento ou ao esvaziamento cardíaco, reduzindo o débito apesar de contratilidade e volemia frequentemente preservadas.",
    clinicalPearl: "Turgência jugular com hipotensão e pulmões limpos sugere obstrução — pense em TEP.",
    options: [
      { text: "Obstrução mecânica ao enchimento ou esvaziamento cardíaco", correct: true },
      { text: "Perda de volume intravascular", rationale: "Define o choque hipovolêmico." },
      { text: "Vasodilatação sistêmica intensa", rationale: "É o mecanismo do distributivo." },
      { text: "Redução primária da contratilidade", rationale: "Corresponde ao cardiogênico." },
    ],
  },
]);

export function getChallengesByLesson(lessonId: string): Challenge[] {
  return challenges.filter((c) => c.lessonId === lessonId).sort((a, b) => a.order - b.order);
}

export function getChallengeById(id: string): Challenge | undefined {
  return challenges.find((c) => c.id === id);
}
