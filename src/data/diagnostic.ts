/**
 * Diagnóstico de maturidade e risco (/diagnostico).
 *
 * The page renders the questions from this file, and the browser script
 * imports the same file to score the answers, so a question, a weight or a
 * recommendation changes in one place only. Everything runs in the visitor's
 * browser: nothing is sent to or stored by the site.
 *
 * Model, in short:
 * - Maturity (0–100): the six layers the Sentinela checks (src/data/layers.ts),
 *   three questions each, every answer scored 0 to 3. "Não sei" scores 0,
 *   because a control nobody can confirm does not protect anyone.
 * - Exposure (0–100): how much a failure would hurt, from the context block
 *   (type of data, dependence on systems, outside demands, size, sector).
 * - Risk (0–100): the maturity gap weighted by exposure, plus a fixed amount
 *   for each critical gap (the answers that most often precede a real attack).
 * - Recommendations: the services in src/data/services.ts, chosen by rules
 *   below, plus the quick wins of the weakest answers.
 */

export type Score = 0 | 1 | 2 | 3;

export interface Option {
  label: string;
  score: Score;
}

export interface Question {
  id: string;
  text: string;
  /** Plain-words help shown under the question. */
  help?: string;
  options: Option[];
  /** What to do when the answer scores 1 or less. Written for the owner. */
  fix: string;
  /** A low answer here is a critical gap: it raises the risk on its own. */
  critical?: { maxScore: Score; title: string };
}

export interface Domain {
  id: string;
  name: string;
  intro: string;
  questions: Question[];
}

const UNKNOWN: Option = { label: 'Não sei', score: 0 };

/* ------------------------------------------------------------------ */
/* Context: who the company is and how much a failure would hurt.      */
/* ------------------------------------------------------------------ */

export const contextQuestions: Question[] = [
  {
    id: 'porte',
    text: 'Quantas pessoas trabalham na empresa?',
    options: [
      { label: 'Até 20', score: 0 },
      { label: 'De 21 a 100', score: 1 },
      { label: 'De 101 a 500', score: 2 },
      { label: 'Mais de 500', score: 3 },
    ],
    fix: '',
  },
  {
    id: 'dados',
    text: 'Qual o dado mais delicado que a empresa guarda?',
    help: 'Pense em sistemas, planilhas, e-mails e pastas compartilhadas.',
    options: [
      { label: 'Quase nenhum dado pessoal', score: 0 },
      { label: 'Cadastro de clientes e funcionários', score: 1 },
      { label: 'Dados financeiros, fiscais ou de pagamento', score: 2 },
      { label: 'Saúde, processos judiciais ou outros dados sensíveis', score: 3 },
    ],
    fix: '',
  },
  {
    id: 'dependencia',
    text: 'Se os sistemas parassem por um dia inteiro, o que aconteceria?',
    options: [
      { label: 'Quase nada, trabalhamos sem eles', score: 0 },
      { label: 'Atrasos, mas a operação continua', score: 1 },
      { label: 'A operação para', score: 2 },
      { label: 'Prejuízo grave, multa contratual ou risco a pessoas', score: 3 },
    ],
    fix: '',
  },
  {
    id: 'exigencia',
    text: 'Clientes, contratos ou auditorias pedem evidências de segurança?',
    help: 'Questionários de segurança, cláusulas de LGPD, exigência de certificação.',
    options: [
      { label: 'Nunca', score: 0 },
      { label: 'Raramente', score: 1 },
      { label: 'Às vezes', score: 2 },
      { label: 'Com frequência', score: 3 },
    ],
    fix: '',
  },
  {
    id: 'incidente',
    text: 'A empresa passou por algum incidente nos últimos 12 meses?',
    help: 'Vírus, sequestro de dados, e-mail invadido, golpe de boleto, vazamento.',
    options: [
      { label: 'Não', score: 0 },
      { label: 'Suspeitamos, mas não confirmamos', score: 1 },
      { label: 'Sim, e já foi resolvido', score: 2 },
      { label: 'Sim, e ainda está acontecendo', score: 3 },
    ],
    fix: '',
  },
];

/* ------------------------------------------------------------------ */
/* Maturity: the six layers of the Sentinela, three questions each.    */
/* ------------------------------------------------------------------ */

export const domains: Domain[] = [
  {
    id: 'governanca',
    name: 'Governança e LGPD',
    intro: 'Quem responde pela segurança e o que está combinado por escrito.',
    questions: [
      {
        id: 'gov-responsavel',
        text: 'Alguém responde pela segurança da informação na empresa?',
        options: [
          { label: 'Ninguém', score: 0 },
          { label: 'O TI cuida quando sobra tempo', score: 1 },
          { label: 'Há um responsável, sem tempo dedicado', score: 2 },
          { label: 'Há um responsável com metas e rotina', score: 3 },
          UNKNOWN,
        ],
        fix: 'Nomear um responsável pela segurança, com tempo reservado na agenda, mesmo que seja externo.',
      },
      {
        id: 'gov-politica',
        text: 'Existem regras escritas de uso de sistemas, senhas e dados?',
        options: [
          { label: 'Não', score: 0 },
          { label: 'Só combinados de boca', score: 1 },
          { label: 'Escritas, mas pouca gente conhece', score: 2 },
          { label: 'Escritas, conhecidas e revisadas', score: 3 },
          UNKNOWN,
        ],
        fix: 'Escrever uma política curta de uso aceitável e pedir a ciência de cada colaborador.',
      },
      {
        id: 'gov-lgpd',
        text: 'Em que ponto está a adequação à LGPD?',
        options: [
          { label: 'Não começamos', score: 0 },
          { label: 'Só documentos ou encarregado nomeado', score: 1 },
          { label: 'Documentos e algumas medidas técnicas', score: 2 },
          { label: 'Adequação acompanhada, com evidências', score: 3 },
          UNKNOWN,
        ],
        fix: 'Mapear onde estão os dados pessoais e quais medidas técnicas os protegem (LGPD, art. 46).',
      },
    ],
  },
  {
    id: 'acessos',
    name: 'Pessoas e acessos',
    intro: 'Quem consegue entrar em cada sistema, e se ainda deveria.',
    questions: [
      {
        id: 'ace-desligamento',
        text: 'Quando alguém sai da empresa, os acessos são removidos?',
        options: [
          { label: 'Não há rotina para isso', score: 0 },
          { label: 'Quando alguém lembra', score: 1 },
          { label: 'No mesmo dia, na maioria dos sistemas', score: 2 },
          { label: 'No mesmo dia, com checklist', score: 3 },
          UNKNOWN,
        ],
        fix: 'Criar um checklist de desligamento com todos os sistemas e revisar hoje quem ainda tem acesso.',
      },
      {
        id: 'ace-compartilhado',
        text: 'As pessoas usam logins compartilhados?',
        help: 'Por exemplo, um único usuário da recepção ou do financeiro para várias pessoas.',
        options: [
          { label: 'É comum', score: 0 },
          { label: 'Em alguns sistemas', score: 1 },
          { label: 'Raramente', score: 2 },
          { label: 'Não, cada pessoa tem o seu', score: 3 },
          UNKNOWN,
        ],
        fix: 'Dar um login individual a cada pessoa, para saber quem fez o quê.',
      },
      {
        id: 'ace-admin',
        text: 'Quem tem permissão de administrador nos computadores?',
        options: [
          { label: 'Todo mundo', score: 0 },
          { label: 'Muita gente', score: 1 },
          { label: 'Só o TI, usando a mesma conta do dia a dia', score: 2 },
          { label: 'Só o TI, com conta separada para isso', score: 3 },
          UNKNOWN,
        ],
        fix: 'Retirar a permissão de administrador de quem não é do TI.',
        critical: { maxScore: 0, title: 'Todos são administradores dos computadores' },
      },
    ],
  },
  {
    id: 'email',
    name: 'E-mail e golpes',
    intro: 'A porta de entrada da maioria dos ataques a PMEs.',
    questions: [
      {
        id: 'ema-mfa',
        text: 'O e-mail da empresa pede verificação em duas etapas?',
        help: 'Além da senha, um código no celular ou um aplicativo autenticador.',
        options: [
          { label: 'Não', score: 0 },
          { label: 'Em algumas contas', score: 1 },
          { label: 'Na maioria das contas', score: 2 },
          { label: 'Em todas, de forma obrigatória', score: 3 },
          UNKNOWN,
        ],
        fix: 'Ativar a verificação em duas etapas em todas as contas de e-mail, começando pela diretoria e pelo financeiro.',
        critical: { maxScore: 1, title: 'E-mail sem verificação em duas etapas' },
      },
      {
        id: 'ema-treino',
        text: 'A equipe sabe reconhecer e-mails e mensagens falsas?',
        options: [
          { label: 'Nunca falamos sobre isso', score: 0 },
          { label: 'Só avisos informais', score: 1 },
          { label: 'Já houve um treinamento', score: 2 },
          { label: 'Treinamento periódico e simulações', score: 3 },
          UNKNOWN,
        ],
        fix: 'Fazer uma conversa de 30 minutos com exemplos reais de golpes e repetir a cada semestre.',
      },
      {
        id: 'ema-pagamento',
        text: 'Mudança de conta bancária ou boleto de fornecedor é confirmada por outro canal?',
        help: 'Por exemplo, ligar para o fornecedor no número que você já tinha antes de pagar.',
        options: [
          { label: 'Não', score: 0 },
          { label: 'Às vezes', score: 1 },
          { label: 'Só em valores altos', score: 2 },
          { label: 'Sempre, é regra escrita', score: 3 },
          UNKNOWN,
        ],
        fix: 'Criar a regra: mudança de dados bancários só vale depois de confirmada por telefone, no contato já conhecido.',
        critical: { maxScore: 0, title: 'Pagamentos sem confirmação por outro canal' },
      },
    ],
  },
  {
    id: 'dispositivos',
    name: 'Computadores e servidores',
    intro: 'O que existe na empresa, se está atualizado e protegido.',
    questions: [
      {
        id: 'dis-inventario',
        text: 'Existe uma lista dos computadores, servidores e sistemas da empresa?',
        options: [
          { label: 'Não', score: 0 },
          { label: 'Parcial ou desatualizada', score: 1 },
          { label: 'Atualizada manualmente', score: 2 },
          { label: 'Atualizada automaticamente', score: 3 },
          UNKNOWN,
        ],
        fix: 'Montar uma planilha com cada equipamento, quem usa e o que está instalado nele.',
      },
      {
        id: 'dis-atualizacao',
        text: 'Como são feitas as atualizações de sistemas e programas?',
        options: [
          { label: 'Quando alguém lembra', score: 0 },
          { label: 'Automáticas em parte dos equipamentos', score: 1 },
          { label: 'Automáticas na maioria, com alguns antigos', score: 2 },
          { label: 'Processo com prazo e verificação', score: 3 },
          UNKNOWN,
        ],
        fix: 'Ligar as atualizações automáticas e listar os equipamentos que não recebem mais atualização.',
        critical: { maxScore: 0, title: 'Atualizações sem rotina' },
      },
      {
        id: 'dis-protecao',
        text: 'Que proteção os computadores têm contra programas maliciosos?',
        options: [
          { label: 'Nenhuma ou não sabemos', score: 0 },
          { label: 'Antivírus gratuito em alguns', score: 1 },
          { label: 'Antivírus em todos', score: 2 },
          { label: 'Proteção gerenciada, com alertas centralizados', score: 3 },
        ],
        fix: 'Garantir proteção ativa em todos os computadores e servidores, com alguém recebendo os alertas.',
      },
    ],
  },
  {
    id: 'rede',
    name: 'Rede e internet',
    intro: 'O que está visível para fora e quem olha os sinais de ataque.',
    questions: [
      {
        id: 'red-exposicao',
        text: 'A empresa sabe o que está exposto na internet?',
        help: 'Sistemas, painéis de administração, câmeras, servidores acessíveis de fora.',
        options: [
          { label: 'Não', score: 0 },
          { label: 'Temos uma ideia geral', score: 1 },
          { label: 'Temos uma lista conhecida', score: 2 },
          { label: 'Verificamos periodicamente', score: 3 },
          UNKNOWN,
        ],
        fix: 'Levantar tudo o que responde na internet com o nome e os endereços da empresa e fechar o que não precisa estar aberto.',
      },
      {
        id: 'red-remoto',
        text: 'Como é o acesso remoto aos sistemas da empresa?',
        options: [
          { label: 'Acesso direto, como área de trabalho remota aberta', score: 0 },
          { label: 'Cada um usa a ferramenta que prefere', score: 1 },
          { label: 'Por VPN', score: 2 },
          { label: 'Por VPN com verificação em duas etapas, ou não usamos', score: 3 },
          UNKNOWN,
        ],
        fix: 'Fechar a área de trabalho remota exposta e concentrar o acesso numa VPN com verificação em duas etapas.',
        critical: { maxScore: 0, title: 'Acesso remoto exposto na internet' },
      },
      {
        id: 'red-monitoramento',
        text: 'Alguém acompanha alertas e registros de acesso?',
        help: 'Logins de madrugada, tentativas de senha, arquivos copiados em massa.',
        options: [
          { label: 'Ninguém', score: 0 },
          { label: 'Só quando dá problema', score: 1 },
          { label: 'O TI olha de vez em quando', score: 2 },
          { label: 'Monitoramento contínuo, com alerta', score: 3 },
          UNKNOWN,
        ],
        fix: 'Definir quem recebe os alertas do e-mail, do firewall e do antivírus, e o que fazer com cada um.',
      },
    ],
  },
  {
    id: 'backup',
    name: 'Backup e recuperação',
    intro: 'Se tudo parar amanhã, em quanto tempo a empresa volta.',
    questions: [
      {
        id: 'bkp-copia',
        text: 'Como são feitas as cópias de segurança?',
        options: [
          { label: 'Não fazemos', score: 0 },
          { label: 'Cópia manual, de vez em quando', score: 1 },
          { label: 'Automática, num disco ou servidor ligado à rede', score: 2 },
          { label: 'Automática, com uma cópia isolada ou protegida', score: 3 },
          UNKNOWN,
        ],
        fix: 'Manter ao menos uma cópia que um ataque não consiga apagar: desconectada da rede ou em nuvem com proteção contra exclusão.',
        critical: { maxScore: 2, title: 'Backup que um ataque consegue apagar' },
      },
      {
        id: 'bkp-teste',
        text: 'Quando a empresa testou restaurar um backup pela última vez?',
        options: [
          { label: 'Nunca', score: 0 },
          { label: 'Há mais de um ano', score: 1 },
          { label: 'No último ano', score: 2 },
          { label: 'Testamos periodicamente e registramos', score: 3 },
          UNKNOWN,
        ],
        fix: 'Restaurar um sistema importante a partir do backup e medir quanto tempo leva.',
      },
      {
        id: 'bkp-plano',
        text: 'Existe um plano para quando um ataque parar a empresa?',
        options: [
          { label: 'Não', score: 0 },
          { label: 'Sabemos para quem ligar', score: 1 },
          { label: 'Plano informal', score: 2 },
          { label: 'Plano escrito e testado', score: 3 },
          UNKNOWN,
        ],
        fix: 'Escrever numa página quem decide, quem avisar e o que não fazer (desligar ou formatar apaga evidências).',
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Levels                                                              */
/* ------------------------------------------------------------------ */

export const maturityLevels = [
  { level: 1, name: 'Inicial', min: 0, text: 'A segurança depende de sorte. Os controles básicos ainda não existem ou ninguém consegue confirmar que existem.' },
  { level: 2, name: 'Reativo', min: 20, text: 'Algumas proteções existem, mas a empresa age depois do problema. Ninguém acompanha a segurança de forma contínua.' },
  { level: 3, name: 'Básico', min: 40, text: 'Os controles essenciais estão parcialmente no lugar. Faltam rotina, verificação e evidências.' },
  { level: 4, name: 'Gerenciado', min: 60, text: 'Há rotina e responsáveis. O próximo passo é medir, monitorar e provar a segurança para clientes e auditores.' },
  { level: 5, name: 'Avançado', min: 80, text: 'A segurança faz parte da gestão. O trabalho agora é manter, testar e melhorar continuamente.' },
] as const;

export const riskLevels = [
  { name: 'Baixo', min: 0, tone: 'ok', text: 'A exposição é pequena para o porte e o tipo de dado da empresa. Vale manter a rotina e verificar periodicamente.' },
  { name: 'Moderado', min: 25, tone: 'alert', text: 'Há lacunas que um ataque comum consegue explorar. Corrigir as prioridades nos próximos meses reduz bastante o risco.' },
  { name: 'Alto', min: 45, tone: 'danger', text: 'Lacunas importantes combinadas com dados ou operação sensíveis. Um ataque comum pode parar a empresa ou expor dados.' },
  { name: 'Crítico', min: 65, tone: 'danger', text: 'A empresa está exposta aos ataques mais comuns e o impacto seria grave. Comece pelas correções desta semana.' },
] as const;

export type RiskTone = (typeof riskLevels)[number]['tone'];

/* ------------------------------------------------------------------ */
/* Scoring                                                             */
/* ------------------------------------------------------------------ */

/** Answers by question id: the index of the chosen option. */
export type Answers = Record<string, number>;

const SENSITIVE_SECTORS = ['clinicas-e-saude', 'advocacia', 'contabilidade'];
const CRITICAL_POINTS = 5;

export interface DomainResult {
  id: string;
  name: string;
  /** 0–100 */
  score: number;
  unknown: number;
}

export interface Gap {
  questionId: string;
  domain: string;
  text: string;
  answer: string;
  score: Score;
  fix: string;
  critical?: string;
}

export interface ServicePick {
  slug: string;
  why: string;
  urgent?: boolean;
}

export interface Result {
  maturity: number;
  maturityLevel: (typeof maturityLevels)[number];
  exposure: number;
  risk: number;
  riskLevel: (typeof riskLevels)[number];
  domains: DomainResult[];
  criticals: Gap[];
  quickWins: Gap[];
  unknownCount: number;
  incidentOngoing: boolean;
  services: ServicePick[];
}

const pick = (q: Question, answers: Answers) => q.options[answers[q.id] ?? -1];
const round = (n: number) => Math.round(Math.max(0, Math.min(100, n)));

export const allQuestions = () => [...contextQuestions, ...domains.flatMap((d) => d.questions)];

export function score(answers: Answers, sector: string): Result {
  // Maturity per domain and overall.
  const gaps: Gap[] = [];
  let unknownCount = 0;
  const domainResults: DomainResult[] = domains.map((d) => {
    let sum = 0;
    let unknown = 0;
    d.questions.forEach((q) => {
      const opt = pick(q, answers);
      const s = opt?.score ?? 0;
      sum += s;
      if (!opt || opt === UNKNOWN) unknown += 1;
      const isCritical = q.critical && s <= q.critical.maxScore;
      if (s <= 1 || isCritical) {
        gaps.push({
          questionId: q.id,
          domain: d.name,
          text: q.text,
          answer: opt?.label ?? 'Sem resposta',
          score: s,
          fix: q.fix,
          critical: isCritical ? q.critical!.title : undefined,
        });
      }
    });
    unknownCount += unknown;
    return { id: d.id, name: d.name, score: round((sum / (d.questions.length * 3)) * 100), unknown };
  });
  const maturity = round(domainResults.reduce((a, d) => a + d.score, 0) / domainResults.length);

  // Exposure from the context block.
  const ctx = (id: string) => pick(contextQuestions.find((q) => q.id === id)!, answers)?.score ?? 0;
  const data = Math.max(ctx('dados'), SENSITIVE_SECTORS.includes(sector) ? 2 : 0);
  const exposure = round(((data * 0.35 + ctx('dependencia') * 0.3 + ctx('porte') * 0.2 + ctx('exigencia') * 0.15) / 3) * 100);

  // Risk: maturity gap weighted by exposure, plus critical gaps and history.
  const criticals = gaps.filter((g) => g.critical);
  const incident = ctx('incidente');
  const incidentOngoing = incident === 3;
  let risk = (100 - maturity) * (0.5 + 0.5 * (exposure / 100)) + criticals.length * CRITICAL_POINTS;
  if (incident === 1 || incident === 2) risk += CRITICAL_POINTS;
  risk = incidentOngoing ? 100 : round(risk);

  const riskLevel = [...riskLevels].reverse().find((l) => risk >= l.min)!;
  const maturityLevel = [...maturityLevels].reverse().find((l) => maturity >= l.min)!;

  // Quick wins: critical gaps first, then the lowest answers, at most five.
  const quickWins = [...gaps].sort((a, b) => Number(!!b.critical) - Number(!!a.critical) || a.score - b.score).slice(0, 5);

  return {
    maturity,
    maturityLevel,
    exposure,
    risk,
    riskLevel,
    domains: domainResults,
    criticals,
    quickWins,
    unknownCount,
    incidentOngoing,
    services: recommend({ maturity, exposure, risk, domains: domainResults, criticals, incident, ctx }),
  };
}

/* ------------------------------------------------------------------ */
/* Recommended path: which services, in which order, and why.          */
/* ------------------------------------------------------------------ */

function recommend(r: {
  maturity: number;
  exposure: number;
  risk: number;
  domains: DomainResult[];
  criticals: Gap[];
  incident: number;
  ctx: (id: string) => number;
}): ServicePick[] {
  const out: ServicePick[] = [];
  const gov = r.domains.find((d) => d.id === 'governanca')!.score;

  if (r.incident === 3) {
    out.push({
      slug: 'resposta-a-incidentes',
      urgent: true,
      why: 'O incidente ainda está acontecendo. Antes de qualquer avaliação, é preciso conter o ataque e preservar as evidências.',
    });
  } else if (r.incident >= 1) {
    out.push({
      slug: 'resposta-a-incidentes',
      why: 'Houve um incidente ou suspeita recente. Vale confirmar se o atacante saiu de fato e fechar a porta que ele usou.',
    });
  }

  out.push({
    slug: 'raio-x-de-seguranca',
    why:
      r.criticals.length > 0
        ? `Este diagnóstico mostra o que a empresa acredita ter. O Raio-X confirma com evidências e encontra o que ninguém sabia, a começar pelas ${r.criticals.length} lacunas críticas apontadas aqui.`
        : 'Este diagnóstico mostra o que a empresa acredita ter. O Raio-X confirma com evidências e encontra o que está exposto sem ninguém saber.',
  });

  if (r.maturity < 70 || r.criticals.length > 0 || r.exposure >= 50) {
    out.push({
      slug: 'sentinela-pme',
      why:
        r.maturity < 40
          ? 'Com a maturidade atual, as correções precisam de acompanhamento mês a mês para não voltarem a abrir.'
          : 'Para manter as correções de pé e ter alguém olhando a segurança todo mês, com alerta no mesmo dia para o que for crítico.',
    });
  }

  if (gov < 60 && (r.ctx('exigencia') >= 2 || r.ctx('porte') >= 2 || r.ctx('dados') >= 2)) {
    out.push({
      slug: 'vciso-fracionado',
      why: 'A empresa precisa responder por segurança e LGPD diante de clientes, contratos ou auditorias, e a governança ainda é o ponto fraco.',
    });
  }

  return out;
}
