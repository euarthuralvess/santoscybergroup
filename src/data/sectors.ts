/**
 * Sectors served. Each entry becomes /setores/[slug], a page written for the
 * owner of that kind of business. Legal references are kept general on
 * purpose and cite only the statute itself; anything sector-specific beyond
 * that should be reviewed before publishing.
 */

export interface Sector {
  slug: string;
  name: string;
  /** Short name for lists. */
  short: string;
  /** The original one-liner from the current site. */
  stake: string;
  intro: string;
  risks: { title: string; text: string }[];
  obligations: string[];
  start: string[]; // service slugs, in recommended order
  seo: { title: string; description: string };
}

export const sectors: Sector[] = [
  {
    slug: 'clinicas-e-saude',
    name: 'Clínicas e saúde',
    short: 'Saúde',
    stake: 'Prontuários e dados sensíveis sob exigência rígida da LGPD.',
    intro:
      'Uma clínica guarda o tipo de dado que a LGPD mais protege: informação de saúde. Ao mesmo tempo, depende de sistemas de agendamento, prontuário e faturamento que não podem parar no meio do expediente.',
    risks: [
      { title: 'Prontuário acessível demais', text: 'Recepção, profissionais e terceiros usando o mesmo login, sem registro de quem viu o quê.' },
      { title: 'Sequestro de dados', text: 'Ransomware que trava agenda e prontuário e paralisa o atendimento.' },
      { title: 'Vazamento por mensagens', text: 'Exames e laudos circulando por e-mail e WhatsApp sem controle.' },
    ],
    obligations: [
      'Dados de saúde são dados pessoais sensíveis na LGPD (art. 5º, II), com regras mais restritas de tratamento (art. 11).',
      'A lei exige medidas técnicas e administrativas de segurança para proteger esses dados (art. 46).',
    ],
    start: ['raio-x-de-seguranca', 'sentinela-pme'],
    seo: {
      title: 'Cibersegurança para clínicas e consultórios: LGPD e dados de saúde',
      description:
        'Proteja prontuários e dados sensíveis de pacientes. Raio-X de segurança e acompanhamento mensal para clínicas, com foco na parte técnica da LGPD.',
    },
  },
  {
    slug: 'contabilidade',
    name: 'Contabilidade',
    short: 'Contabilidade',
    stake: 'Dados fiscais e financeiros de dezenas de clientes em um só lugar.',
    intro:
      'Um escritório contábil concentra a vida fiscal e financeira de dezenas ou centenas de empresas. Para um atacante, invadir um escritório vale o mesmo que invadir todos os clientes dele.',
    risks: [
      { title: 'Certificados digitais expostos', text: 'Certificados A1 de clientes guardados em pastas compartilhadas ou em computadores sem proteção.' },
      { title: 'Golpe do boleto e do e-mail falso', text: 'Mensagens que imitam a Receita, o banco ou o próprio cliente para desviar pagamentos.' },
      { title: 'Acesso amplo demais', text: 'Toda a equipe com acesso a todos os clientes, inclusive depois de sair do escritório.' },
    ],
    obligations: [
      'O escritório trata dados pessoais de clientes e dos funcionários deles e responde pela segurança desses dados (LGPD, art. 46).',
      'Incidentes que possam causar risco ou dano relevante aos titulares devem ser comunicados à ANPD e aos titulares (LGPD, art. 48).',
    ],
    start: ['raio-x-de-seguranca', 'sentinela-pme'],
    seo: {
      title: 'Segurança da informação para escritórios de contabilidade',
      description:
        'Proteja certificados digitais, dados fiscais e financeiros dos seus clientes. Cibersegurança para escritórios contábeis com acompanhamento mensal.',
    },
  },
  {
    slug: 'e-commerce',
    name: 'E-commerce',
    short: 'E-commerce',
    stake: 'Pagamentos, fraude e disponibilidade da loja como receita direta.',
    intro:
      'Numa loja online, cada minuto fora do ar é venda perdida, e cada falha no checkout é um risco para o cliente e para a reputação da marca.',
    risks: [
      { title: 'Loja fora do ar', text: 'Ataques de negação de serviço e falhas de configuração que derrubam o site em datas de pico.' },
      { title: 'Contas de clientes invadidas', text: 'Senhas vazadas de outros sites usadas para entrar na sua loja e comprar com o saldo alheio.' },
      { title: 'Plugins e integrações desatualizados', text: 'Extensões da plataforma com falhas conhecidas abrindo caminho para o checkout.' },
    ],
    obligations: [
      'A loja trata dados pessoais de clientes e responde pela segurança deles (LGPD, art. 46).',
      'Quem armazena, processa ou transmite dados de cartão está sujeito ao padrão PCI DSS, exigido pelas bandeiras.',
    ],
    start: ['raio-x-de-seguranca', 'sentinela-pme'],
    seo: {
      title: 'Cibersegurança para e-commerce: fraude, disponibilidade e dados de clientes',
      description:
        'Mantenha a loja no ar e os dados dos clientes protegidos. Avaliação de vulnerabilidades e monitoramento mensal para lojas virtuais.',
    },
  },
  {
    slug: 'industria-e-logistica',
    name: 'Indústria e logística',
    short: 'Indústria',
    stake: 'Operação que não pode parar e ativos cada vez mais conectados.',
    intro:
      'Na indústria e na logística, um ataque não vaza só dados: ele para a linha, atrasa a frota e quebra contratos de entrega. E cada máquina, câmera e sensor conectado é mais uma porta.',
    risks: [
      { title: 'Ransomware na operação', text: 'Sistemas de produção, WMS e ERP travados até o pagamento do resgate.' },
      { title: 'Equipamentos conectados sem proteção', text: 'Câmeras, controladores e sensores com senha de fábrica e acesso pela internet.' },
      { title: 'Acesso remoto de fornecedores', text: 'Terceiros com acesso permanente à rede, sem controle de quando e como entram.' },
    ],
    obligations: [
      'A empresa responde pela segurança dos dados pessoais de funcionários, clientes e parceiros (LGPD, art. 46).',
      'Grandes clientes e contratos de fornecimento costumam exigir evidências de segurança da informação.',
    ],
    start: ['raio-x-de-seguranca', 'sentinela-pme', 'vciso-fracionado'],
    seo: {
      title: 'Segurança da informação para indústria e logística',
      description:
        'Proteja a operação contra ransomware e acessos indevidos a equipamentos conectados. Cibersegurança para indústrias, transportadoras e operadores logísticos.',
    },
  },
  {
    slug: 'advocacia',
    name: 'Advocacia',
    short: 'Advocacia',
    stake: 'Sigilo de clientes e processos como obrigação profissional e legal.',
    intro:
      'Para um escritório de advocacia, o sigilo é a base da relação com o cliente. Um vazamento de peças, contratos ou estratégias processuais atinge a confiança e a responsabilidade profissional ao mesmo tempo.',
    risks: [
      { title: 'E-mail como porta de entrada', text: 'Contas sem verificação em duas etapas e mensagens falsas que imitam tribunais e clientes.' },
      { title: 'Documentos fora de controle', text: 'Peças e contratos em nuvens pessoais, pendrives e computadores de casa.' },
      { title: 'Ex-colaboradores com acesso', text: 'Associados e estagiários que saem do escritório e continuam com acesso aos sistemas.' },
    ],
    obligations: [
      'O Estatuto da Advocacia garante a inviolabilidade dos instrumentos de trabalho e da correspondência eletrônica relativos ao exercício da profissão (Lei 8.906/1994, art. 7º, II), o que pressupõe protegê-los.',
      'O escritório responde pela segurança dos dados pessoais de clientes e partes (LGPD, art. 46).',
    ],
    start: ['raio-x-de-seguranca', 'vciso-fracionado'],
    seo: {
      title: 'Cibersegurança para escritórios de advocacia: sigilo e LGPD',
      description:
        'Proteja o sigilo de clientes e processos. Segurança da informação para escritórios de advocacia, com avaliação de riscos e governança de segurança.',
    },
  },
  {
    slug: 'construcao-civil',
    name: 'Construção civil',
    short: 'Construção',
    stake: 'Projetos, contratos e dados de obra distribuídos entre equipes.',
    intro:
      'Construtoras trabalham com informação espalhada: escritório, canteiros, projetistas, fornecedores. Quanto mais gente e mais lugares, mais difícil saber quem acessa o quê.',
    risks: [
      { title: 'Desvio de pagamentos', text: 'E-mails falsos de fornecedores informando "nova conta bancária" no meio da obra.' },
      { title: 'Projetos e propostas vazados', text: 'Arquivos de projeto e orçamentos de licitação compartilhados sem controle.' },
      { title: 'Canteiro sem padrão', text: 'Computadores e redes de obra montados às pressas, sem atualização nem cópia de segurança.' },
    ],
    obligations: [
      'A empresa responde pela segurança dos dados pessoais de funcionários, clientes e compradores (LGPD, art. 46).',
      'Contratos públicos e com grandes clientes podem exigir comprovação de controles de segurança.',
    ],
    start: ['raio-x-de-seguranca', 'sentinela-pme'],
    seo: {
      title: 'Segurança da informação para construtoras e incorporadoras',
      description:
        'Proteja projetos, contratos e pagamentos entre escritório, canteiros e fornecedores. Cibersegurança para construção civil.',
    },
  },
];

export const sectorBySlug = (slug: string) => sectors.find((s) => s.slug === slug);
export const sectorHref = (s: Pick<Sector, 'slug'>) => `/setores/${s.slug}`;
