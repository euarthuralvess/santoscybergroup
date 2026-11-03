/**
 * Illustrative findings used by the "Raio-X em três passos" demo on the home
 * page. Not client data: the section is labelled as an example.
 */
export const findings = [
  { area: 'Superfície exposta', title: 'Acesso remoto aberto para a internet', severity: 'Alta', system: 'Servidor de arquivos', business: 'Toda a operação', rank: 1, status: 'Prioridade' },
  { area: 'E-mail', title: 'Diretoria sem verificação em duas etapas', severity: 'Média', system: 'E-mail corporativo', business: 'Pagamentos e contratos', rank: 2, status: 'Em seguida' },
  { area: 'Acessos', title: 'Conta de ex-funcionário ainda ativa', severity: 'Média', system: 'ERP', business: 'Financeiro', rank: 3, status: 'Planejada' },
  { area: 'Backup', title: 'Cópia de segurança no mesmo servidor', severity: 'Alta', system: 'Servidor de arquivos', business: 'Recuperação após ataque', rank: 4, status: 'Planejada' },
  { area: 'Dispositivos', title: 'Impressora com senha de fábrica', severity: 'Alta', system: 'Rede interna', business: 'Sem dados sensíveis', rank: 5, status: 'Monitorar' },
] as const;

export const findingSteps = [
  { label: 'Encontra as exposições', text: 'A varredura lista o que está exposto, com a severidade técnica de cada achado.' },
  { label: 'Liga ao negócio', text: 'Cada achado é ligado ao sistema em que está e à operação que depende dele.' },
  { label: 'Prioriza pelo impacto', text: 'A ordem final segue o risco para o negócio, não só a nota técnica.' },
];
