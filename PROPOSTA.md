# Proposta: novo site da Santos Cyber Group

## Diagnóstico do site atual

O site atual (santoscybergroup.com.br) tem bom conteúdo, mas a forma trabalha contra a venda:

1. **Uma página só.** Os quatro serviços e os seis setores existem apenas como trechos da home. O Google não tem página para ranquear em buscas como "vCISO para PME", "resposta a incidentes" ou "segurança para clínicas".
2. **Visual de template.** Azul neon, grade de fundo e cards todos iguais: o mesmo visual de centenas de sites de segurança. Nada transmite que a empresa entrega algo concreto.
3. **Marca centrada em pessoa.** O nome é "Group", mas o site fala de "Arthur" do início ao fim, sem estrutura para crescer com time e casos.
4. **Promessa de "sem jargão" quebrada.** SOC, SIEM, IR, EDR, YARA-L e MITRE ATT&CK aparecem sem explicação.
5. **Lacunas de confiança.** Não há política de privacidade (e a empresa vende LGPD), nem CNPJ, e-mail, formulário ou canal para reportar vulnerabilidade.
6. **Logo em JPEG embutido** no HTML, sem versão vetorial.

## O que o novo site entrega

**Visual de produto de segurança, não de template.** Navy profundo em camadas, tipografia fina e mockups ilustrativos que mostram o que o cliente recebe: a visão do Raio-X com as prioridades, o plano de ação, o alerta no mesmo dia e o relatório de 2 páginas. Quem visita vê o serviço funcionando antes de falar com alguém.

**Arquitetura que escala.** São 22 páginas geradas a partir de arquivos de dados:

- Home com hero, demonstração interativa do Raio-X em 3 passos, as 6 camadas que o Sentinela verifica, entregas, serviços, processo, fundador, compromissos, formação, setores, depoimentos, tecnologia, artigos, FAQ e chamada final.
- 4 páginas de serviço (Raio-X, Sentinela PME, vCISO Fracionado, Resposta a Incidentes), cada uma com o que é, o que o cliente recebe, como funciona, FAQ e outros serviços.
- 6 páginas de setor (saúde, contabilidade, e-commerce, indústria e logística, advocacia, construção), cada uma com riscos típicos, o que a lei pede e por onde começar.
- Método, Sobre, Insights com 3 artigos iniciais, Contato, Privacidade e 404.

Novo serviço, setor ou artigo é uma entrada num arquivo, e a página, o sitemap, os dados estruturados e o menu do rodapé acompanham sozinhos.

**Segurança como prova.** O site de uma empresa de segurança é a primeira auditoria que o cliente faz:

- Política de segurança de conteúdo (CSP) estrita, sem nenhum script inline, mais HSTS e cabeçalhos de proteção.
- Fontes e arquivos servidos pelo próprio site, sem chamadas a terceiros nem cookies de rastreamento.
- `security.txt` (RFC 9116) para quem quiser reportar uma vulnerabilidade.
- O formulário de contato não armazena nada: monta a mensagem e abre o WhatsApp.
- Política de privacidade escrita para a realidade do site.

**Encontrável por Google e por assistentes de IA.** Dados estruturados em todas as páginas (empresa, fundador com credenciais, serviços, FAQ, artigos), sitemap, `llms.txt` e títulos e descrições escritos por página.

**Marca preservada.** O escudo SG foi redesenhado em vetor, nítido do favicon ao telão, e o azul da marca virou a cor principal do sistema.

## O que precisamos da Santos para publicar

1. Razão social, CNPJ e e-mail comercial.
2. Validação das etapas e respostas de cada serviço, e o escopo dos planos Essencial e Gerenciado.
3. Revisão dos 3 artigos iniciais.
4. Autorização para citar os clientes e, se possível, os logos.
5. Retrato profissional (opcional, recomendado).

## Publicação

Hospedagem recomendada: Cloudflare Pages, que já fica na frente do site atual. A troca é feita apontando o domínio, sem mexer em e-mail. Até a aprovação, a versão de prévia fica fora do Google.
