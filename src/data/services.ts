/**
 * Services. The home page, /servicos, each /servicos/[slug] page, the JSON-LD
 * OfferCatalog and llms.txt are all generated from this list. Adding a service
 * is adding an entry here.
 *
 * `route` places the service on the protection route drawn on the home page:
 * entry → recurring → governance. Incident response sits outside the route on
 * purpose: it is what you call when the route was never walked.
 */

export type ServiceRoute = 'entrada' | 'recorrente' | 'governanca' | 'emergencia';

export interface Service {
  slug: string;
  name: string;
  route: ServiceRoute;
  /** How it is sold, in plain words. */
  format: string;
  /** One line: what the client gets. */
  promise: string;
  summary: string;
  body: string[];
  deliverables: string[];
  steps: { title: string; text: string }[];
  idealFor: string;
  offerNote?: string;
  faq: { q: string; a: string }[];
  seo: { title: string; description: string };
}

export const services: Service[] = [
  {
    slug: 'raio-x-de-seguranca',
    name: 'Raio-X de Segurança',
    route: 'entrada',
    format: 'Projeto pontual, ponto de entrada',
    promise: 'Onde a sua empresa está exposta, em poucos dias.',
    summary:
      'Uma avaliação objetiva das suas vulnerabilidades, com um plano de ação priorizado pelo que realmente coloca o negócio em risco.',
    body: [
      'O Raio-X é a forma mais rápida de sair do achismo. Olhamos a empresa do jeito que um atacante olharia: o que está visível na internet, quais sistemas estão desatualizados, quem tem acesso a quê e onde estão os dados que mais importam.',
      'O resultado não é uma lista de 300 alertas técnicos. É um relatório que separa o que é urgente do que pode esperar, explicado em linguagem de negócio, com o próximo passo de cada item.',
    ],
    deliverables: [
      'Varredura de exposições e vulnerabilidades',
      'Relatório de riscos priorizado pelo impacto no negócio',
      'Plano de correção com próximos passos para o seu TI',
    ],
    steps: [
      { title: 'Conversa inicial', text: 'Entendemos como a empresa funciona, quais sistemas usa e o que mais preocupa.' },
      { title: 'Levantamento', text: 'Varremos o que está exposto e avaliamos os controles essenciais de segurança.' },
      { title: 'Relatório e plano', text: 'Você recebe os riscos em ordem de prioridade e o que fazer com cada um.' },
    ],
    idealFor: 'Quem quer entender o tamanho do problema antes de decidir qualquer investimento.',
    offerNote: '50% do valor do Raio-X vira crédito se você assinar o Sentinela PME em até 30 dias.',
    faq: [
      {
        q: 'O Raio-X para a operação da empresa?',
        a: 'Não. A varredura é planejada para não interferir no funcionamento dos sistemas, e o horário de cada etapa é combinado com você.',
      },
      {
        q: 'Preciso dar acesso a todos os sistemas?',
        a: 'Só ao que for necessário para a avaliação, e tudo é combinado antes. Parte do Raio-X olha apenas o que já está visível na internet, sem acesso interno.',
      },
    ],
    seo: {
      title: 'Raio-X de Segurança para PMEs: avaliação de vulnerabilidades',
      description:
        'Descubra onde a sua empresa está exposta: varredura de vulnerabilidades, relatório de riscos priorizado e plano de correção em linguagem de negócio.',
    },
  },
  {
    slug: 'sentinela-pme',
    name: 'Sentinela PME',
    route: 'recorrente',
    format: 'Programa mensal, carro-chefe',
    promise: 'Alguém olhando a segurança da sua empresa todo mês.',
    summary:
      'Todo mês verificamos os controles essenciais da sua empresa, definimos o que corrigir primeiro e acompanhamos a evolução, seguindo o CIS Controls, um padrão internacional de segurança básica.',
    body: [
      'Segurança não é um projeto que termina. Sistemas mudam, pessoas entram e saem, novas falhas são descobertas toda semana. O Sentinela é o acompanhamento contínuo que uma empresa grande tem com um time interno, no tamanho e no orçamento de uma PME.',
      'Usamos como referência o CIS Controls, conjunto de práticas de segurança mantido pelo Center for Internet Security e adotado no mundo inteiro. Ele diz o que proteger primeiro, e nós adaptamos à realidade da sua empresa.',
    ],
    deliverables: [
      'Verificação mensal dos controles essenciais',
      'Prioridades claras para o seu TI executar',
      'Relatório mensal de 2 páginas em linguagem de negócio',
      'Alerta no mesmo dia para achados críticos',
    ],
    steps: [
      { title: 'Linha de base', text: 'Partimos do Raio-X para saber de onde a empresa começa.' },
      { title: 'Ciclo mensal', text: 'Verificamos os controles, priorizamos as correções e o seu TI executa.' },
      { title: 'Relatório', text: 'Você recebe a evolução do mês em duas páginas que qualquer gestor entende.' },
    ],
    idealFor: 'Quem hoje não saberia dizer se a empresa já foi invadida.',
    offerNote: 'Disponível nos planos Essencial e Gerenciado. O escopo de cada plano é apresentado na conversa inicial.',
    faq: [
      {
        q: 'O que acontece se encontrarem algo grave?',
        a: 'Achados críticos geram alerta no mesmo dia, com a orientação do que fazer. Não esperamos o relatório do mês.',
      },
      {
        q: 'Quem faz as correções?',
        a: 'O seu TI, interno ou terceirizado, com as nossas prioridades e orientação. Depois verificamos se a correção funcionou.',
      },
    ],
    seo: {
      title: 'Sentinela PME: segurança da informação gerenciada todo mês',
      description:
        'Programa mensal de cibersegurança para PMEs pelo CIS Controls: verificação de controles, prioridades para o seu TI, relatório de 2 páginas e alerta no mesmo dia.',
    },
  },
  {
    slug: 'vciso-fracionado',
    name: 'vCISO Fracionado',
    route: 'governanca',
    format: 'Recorrente, horas mensais',
    promise: 'Um líder de segurança sob demanda.',
    summary:
      'A direção estratégica de segurança e LGPD que a sua empresa precisa, em horas mensais, sem o custo de um executivo dedicado em folha.',
    body: [
      'CISO é o executivo responsável pela segurança da informação de uma empresa. Toda empresa média precisa dessa função quando clientes, auditorias e contratos começam a perguntar como ela protege os dados. Poucas conseguem pagar alguém em tempo integral.',
      'No modelo fracionado, você tem essa liderança algumas horas por mês: alguém que define a política, conduz a gestão de riscos, responde questionários de segurança de clientes e representa a empresa em auditorias.',
    ],
    deliverables: [
      'Política de segurança e adequação técnica à LGPD',
      'Gestão de riscos e definição de prioridades',
      'Apoio em auditorias, questionários de clientes e contratos',
    ],
    steps: [
      { title: 'Diagnóstico de governança', text: 'Levantamos políticas, responsabilidades e exigências de clientes e contratos.' },
      { title: 'Plano de segurança', text: 'Definimos metas, prioridades e quem responde por cada uma.' },
      { title: 'Condução', text: 'Acompanhamos a execução e representamos a segurança diante de clientes e auditores.' },
    ],
    idealFor: 'Empresa média que precisa responder por governança diante de clientes, sócios ou auditores.',
    faq: [
      {
        q: 'Qual a diferença para o Sentinela?',
        a: 'O Sentinela cuida da verificação técnica mensal. O vCISO cuida da direção: políticas, riscos, contratos e auditorias. Muitas empresas usam os dois juntos.',
      },
      {
        q: 'O vCISO substitui o encarregado de dados (DPO)?',
        a: 'Não necessariamente. O vCISO apoia a parte de segurança que a LGPD exige e trabalha junto com o encarregado e o jurídico da empresa.',
      },
    ],
    seo: {
      title: 'vCISO fracionado: liderança de segurança e LGPD sob demanda',
      description:
        'Direção estratégica de segurança da informação e LGPD em horas mensais: política, gestão de riscos, auditorias e contratos, sem um executivo em folha.',
    },
  },
  {
    slug: 'resposta-a-incidentes',
    name: 'Resposta a Incidentes',
    route: 'emergencia',
    format: 'Sob demanda, conforme agenda',
    promise: 'Quando o ataque já aconteceu.',
    summary:
      'Apoio para conter, investigar e recuperar a sua operação, com relatório do que ocorreu e de como evitar que aconteça de novo.',
    body: [
      'Um incidente é decidido nas primeiras horas: o que desligar, o que preservar, quem avisar. Decisões tomadas no susto apagam evidências e aumentam o prejuízo.',
      'Entramos para conter a ameaça, entender o que aconteceu e colocar a operação de pé de novo. Se dados pessoais foram afetados, a LGPD pode exigir comunicação à ANPD e aos titulares, e o relatório da investigação é a base dessa comunicação.',
    ],
    deliverables: [
      'Contenção e erradicação da ameaça',
      'Investigação e linha do tempo do incidente',
      'Plano de recuperação e lições aprendidas',
      'Relatório do que ocorreu e de como evitar a reincidência',
    ],
    steps: [
      { title: 'Contenção', text: 'Isolamos o que foi afetado e paramos o avanço do ataque, preservando as evidências.' },
      { title: 'Investigação', text: 'Reconstruímos o que aconteceu: por onde entrou, o que foi acessado, desde quando.' },
      { title: 'Recuperação', text: 'Apoiamos a volta da operação e fechamos a porta que foi usada.' },
    ],
    idealFor: 'Empresa em crise que precisa de resposta agora.',
    offerNote: 'Atendimento conforme disponibilidade de agenda.',
    faq: [
      {
        q: 'O que eu faço antes de vocês chegarem?',
        a: 'Não desligue nem formate os computadores afetados: isso apaga evidências. Desconecte da rede o que estiver comprometido, troque as senhas de contas administrativas a partir de um aparelho limpo e fale conosco.',
      },
      {
        q: 'Preciso avisar a ANPD?',
        a: 'Se o incidente puder causar risco ou dano relevante aos titulares de dados, sim. O regulamento da ANPD prevê prazo de três dias úteis a partir do conhecimento do incidente. A investigação ajuda a definir se a comunicação é necessária e o que informar.',
      },
    ],
    seo: {
      title: 'Resposta a incidentes de segurança para empresas',
      description:
        'Sofreu um ataque? Contenção, investigação, linha do tempo do incidente e plano de recuperação, com relatório para a diretoria e para a comunicação à ANPD.',
    },
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
export const serviceHref = (s: Pick<Service, 'slug'>) => `/servicos/${s.slug}`;
