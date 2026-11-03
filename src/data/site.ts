/**
 * Single source of truth for everything the site says about the company.
 * Pages, JSON-LD, llms.txt and security.txt are all built from here, so a
 * fact changes in one place only.
 *
 * Every value below was taken from the current santoscybergroup.com.br.
 * Empty strings are facts the company still has to provide (see README).
 */

export const site = {
  name: 'Santos Cyber Group',
  legalName: 'Arthur A. dos Santos', // razão social
  tradeName: 'AA Consultoria e Soluções em TI', // nome fantasia
  cnpj: '50.486.595/0001-05',
  url: 'https://www.santoscybergroup.com.br',
  lang: 'pt-BR',
  locale: 'pt_BR',
  tagline: 'Segurança sem ângulo morto',
  description:
    'Cibersegurança para pequenas e médias empresas: Raio-X de segurança, acompanhamento mensal pelo CIS Controls, governança e LGPD, e resposta a incidentes. Natal/RN, atendimento em todo o Brasil.',
  city: 'Natal',
  state: 'RN',
  region: 'Natal/RN',
  areaServed: 'Brasil',
  whatsapp: '5584999316830',
  whatsappDisplay: '(84) 99931-6830',
  whatsappGreeting: 'Olá, quero agendar uma conversa sobre a segurança da minha empresa.',
  email: '', // e-mail comercial — a informar
  securityEmail: '', // para security.txt (ex.: seguranca@...) — a informar
  social: {
    linkedin: 'https://www.linkedin.com/in/euarthuralvess',
    telegram: 'https://t.me/euarthuralvess',
    github: 'https://github.com/euarthuralvess',
  },
};

export const whatsappUrl = (text: string = site.whatsappGreeting) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export const founder = {
  name: 'Arthur Alves dos Santos',
  shortName: 'Arthur Alves',
  role: 'Fundador e responsável técnico',
  summary:
    'Atua no Blue Team de uma das maiores locadoras de veículos do Brasil, defendendo uma operação de grande porte todos os dias. Fundou a Santos Cyber Group para levar esse mesmo método a empresas que não podem manter um time de segurança próprio.',
  career: [
    {
      period: 'Atual',
      org: 'Locadora de veículos de grande porte',
      role: 'Blue Team',
      text: 'Defesa de uma das maiores locadoras de veículos do Brasil: detecção, resposta a incidentes e inteligência de ameaças em escala corporativa.',
    },
    {
      period: '2020–2023',
      org: 'GCTI, Prefeitura de Parnamirim',
      role: 'De estagiário a analista',
      text: 'Monitoramento (Grafana, Zabbix), gestão de acessos em Active Directory e suporte técnico em ambiente crítico de operação municipal.',
    },
  ],
  credentials: [
    { name: 'Google Security Operations: Deep Dive', issuer: 'Google', year: 2024, official: true },
    { name: 'Google Security Operations: Fundamentals', issuer: 'Google', year: 2024, official: true },
    { name: 'CrowdStrike Falcon: Investigation Fundamentals', issuer: 'CrowdStrike', year: 2024, official: true },
    { name: 'CrowdStrike Falcon: Vulnerability Management', issuer: 'CrowdStrike', year: 2023, official: true },
    { name: 'CrowdStrike Falcon: Firewall Management', issuer: 'CrowdStrike', year: 2023, official: true },
    { name: 'Especialista em Prevenção de Fraudes Online (COFPS)', issuer: 'Hack & Fix', year: 2026, official: false },
  ],
  education: [
    { name: 'Pós-graduação em Cibersegurança e Gestão da Informação', school: 'UFRN', status: 'em andamento' },
    { name: 'Tecnólogo em Sistemas para Internet', school: '', status: 'concluído' },
  ],
  talks: [
    {
      year: 2026,
      event: 'Google I/O Extended 2026, GDG Natal',
      title: 'IA generativa como vetor de ataque: o que os devs constroem hoje, o SOC enfrenta amanhã',
    },
    {
      year: 2019,
      event: 'V Semana de Ciência e Tecnologia, IFRN Parnamirim',
      title: 'Segurança em IoT na Indústria 4.0',
    },
    {
      year: 2018,
      event: 'Darkwaves Conf., Instituto Metrópole Digital (UFRN)',
      title: 'Insegurança em IoT',
    },
  ],
  communities: ['DarkWaves', 'OWASP Natal', 'SunSec', 'GDG Natal'],
};

/** Tools the team operates, grouped by what they are for, in plain words. */
export const toolGroups = [
  { purpose: 'Detecção e monitoramento (SIEM)', tools: ['Google SecOps', 'Wazuh', 'IBM QRadar'] },
  { purpose: 'Proteção de computadores e servidores (EDR)', tools: ['CrowdStrike Falcon', 'Microsoft Defender'] },
  { purpose: 'Busca de vulnerabilidades', tools: ['OpenVAS', 'Nuclei', 'Qualys'] },
  { purpose: 'Proteção de sites e aplicações', tools: ['Cloudflare', 'Akamai'] },
  { purpose: 'Observabilidade', tools: ['Grafana', 'Zabbix'] },
  { purpose: 'Referências de método', tools: ['CIS Controls', 'NIST', 'ISO 27001', 'MITRE ATT&CK'] },
  { purpose: 'Automação da operação', tools: ['n8n', 'YARA-L'] },
];

export const clients = [
  { name: 'FIERN', country: 'Brasil' },
  { name: 'Dyson Tech', country: 'Brasil' },
  { name: 'Parnamirim Suplementos', country: 'Brasil' },
  { name: 'COMAV Transportes', country: 'Brasil' },
  { name: 'Drive On Holidays', country: 'Portugal' },
];

export const testimonials = [
  {
    quote:
      'A consultoria do Arthur foi fundamental para elevarmos o nível de maturidade da segurança da informação aqui na Dyson Tech. Ele trouxe uma visão estratégica, prática e altamente especializada, identificando vulnerabilidades e estruturando defesas sem impactar a agilidade da nossa operação. Hoje rodamos nossos projetos com total confiança e tranquilidade.',
    name: 'Djalma Neto',
    role: 'Diretor de Tecnologia',
    company: 'Dyson Tech',
  },
  {
    quote:
      'Gostaríamos de agradecer pela sua atenção e pelo auxílio prestado na investigação do problema em nossa rede. Reconhecemos o tempo e a dedicação envolvidos na análise realizada.',
    name: 'Sterffany Castro',
    role: '',
    company: 'COMAV Transportes',
  },
];

/**
 * Blind spots most small and mid-sized companies carry. Each one is answered
 * by a service further down the page.
 */
export const blindSpots = [
  {
    term: 'Ninguém olhando os sinais',
    text: 'Acessos estranhos, logins de madrugada, arquivos sendo copiados. Os sinais aparecem antes do ataque, mas ninguém está olhando.',
  },
  {
    term: 'LGPD só no papel',
    text: 'Ter política e encarregado não basta. A lei pede medidas técnicas: controle de acesso, registros, cópias de segurança, criptografia.',
  },
  {
    term: 'Sistemas e ERP expostos',
    text: 'Portas abertas para a internet, senhas padrão, versões sem atualização. É por onde a maioria dos ataques entra.',
  },
  {
    term: 'TI sem visibilidade',
    text: 'O time de TI resolve o dia a dia, mas não tem tempo nem ferramenta para saber o que está exposto.',
  },
  {
    term: 'Especialista fora do orçamento',
    text: 'Um profissional sênior de segurança em folha custa mais do que a maioria das PMEs pode pagar.',
  },
  {
    term: 'Resposta só depois do estrago',
    text: 'Sem plano, a empresa descobre o incidente tarde e decide tudo no susto. Cada hora de atraso aumenta o prejuízo.',
  },
];

export const faq = [
  {
    q: 'Minha empresa é pequena. Alguém realmente atacaria?',
    a: 'Sim. A maior parte dos ataques é automatizada: robôs varrem a internet atrás de qualquer sistema exposto, sem escolher o tamanho da empresa. Empresas menores costumam ser alvo mais fácil justamente por não terem ninguém monitorando.',
  },
  {
    q: 'Preciso trocar meu time ou fornecedor de TI?',
    a: 'Não. Trabalhamos junto com o TI que você já tem, interno ou terceirizado. Nós dizemos o que corrigir e em que ordem; o seu TI executa, e nós verificamos.',
  },
  {
    q: 'Vocês vão me obrigar a comprar licenças caras?',
    a: 'Não. Priorizamos o que você já tem e ferramentas que cabem no orçamento de uma PME. Quando uma compra faz sentido, explicamos o porquê e o tamanho do risco que ela reduz.',
  },
  {
    q: 'Por onde eu começo?',
    a: 'Por uma conversa gratuita. Se fizer sentido, o próximo passo é o Raio-X de Segurança, que mostra onde a empresa está exposta e o que corrigir primeiro. Se você assinar o Sentinela PME em até 30 dias, metade do valor do Raio-X vira crédito.',
  },
  {
    q: 'Vocês atendem fora de Natal?',
    a: 'Sim. O atendimento é remoto para todo o Brasil, e já atendemos cliente em Portugal.',
  },
  {
    q: 'Isso deixa minha empresa em conformidade com a LGPD?',
    a: 'Ajuda a cumprir a parte técnica, que é a mais esquecida: o artigo 46 da LGPD exige medidas de segurança para proteger dados pessoais. Conformidade completa também envolve questões jurídicas, e por isso trabalhamos bem ao lado do seu advogado ou consultor de privacidade.',
  },
];

export const nav = [
  { label: 'Serviços', href: '/servicos' },
  { label: 'Setores', href: '/setores' },
  { label: 'Método', href: '/metodo' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Insights', href: '/insights' },
];
