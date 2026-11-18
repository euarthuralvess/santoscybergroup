/**
 * /diagnostico: one step at a time, then the score, rendered in the browser.
 * Nothing is sent to or stored by this site. The visitor may send the result
 * through WhatsApp, which opens a message they can read before sending.
 *
 * All text is set with textContent: no answer is ever parsed as HTML.
 */
import { score, maturityLevels, type Answers, type Result } from '../data/diagnostic';
import { services, serviceHref } from '../data/services';
import { sectors } from '../data/sectors';
import { site } from '../data/site';

const form = document.querySelector<HTMLFormElement>('[data-diag-form]');
const resultEl = document.querySelector<HTMLElement>('[data-diag-result]');

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, cls?: string) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (cls) node.className = cls;
  return node;
};

if (form && resultEl) {
  const steps = [...form.querySelectorAll<HTMLElement>('[data-step]')];
  const back = form.querySelector<HTMLButtonElement>('[data-diag-back]')!;
  const next = form.querySelector<HTMLButtonElement>('[data-diag-next]')!;
  const error = form.querySelector<HTMLElement>('[data-diag-error]')!;
  const progress = form.querySelector<HTMLElement>('[data-diag-progress]')!;
  const stepLabel = form.querySelector<HTMLElement>('[data-diag-step-label]')!;
  const stepCount = form.querySelector<HTMLElement>('[data-diag-step-count]')!;
  const bar = form.querySelector<HTMLElement>('[data-diag-bar]')!;
  let current = 0;
  let last: { result: Result; sector: string; porte: string } | null = null;

  const show = (i: number, scroll = true) => {
    current = i;
    steps.forEach((s, si) => s.toggleAttribute('data-current', si === i));
    back.hidden = i === 0;
    next.textContent = i === steps.length - 1 ? 'Ver meu diagnóstico' : 'Continuar';
    stepLabel.textContent = steps[i].dataset.stepName ?? '';
    stepCount.textContent = `Etapa ${i + 1} de ${steps.length}`;
    bar.style.width = `${(i / steps.length) * 100}%`;
    error.hidden = true;
    if (scroll) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /** Marks unanswered questions of a step; returns true when all are answered. */
  const validate = (step: HTMLElement) => {
    const missing = [...step.querySelectorAll<HTMLFieldSetElement>('fieldset[data-q]')].filter((fs) => {
      const empty = !fs.querySelector('input:checked');
      fs.setAttribute('aria-invalid', String(empty));
      return empty;
    });
    error.hidden = missing.length === 0;
    missing[0]?.querySelector<HTMLInputElement>('input')?.focus();
    return missing.length === 0;
  };

  form.addEventListener('change', (e) => {
    const fs = (e.target as HTMLElement).closest('fieldset[data-q]');
    if (fs?.getAttribute('aria-invalid') === 'true') fs.setAttribute('aria-invalid', 'false');
    if (!form.querySelector('fieldset[aria-invalid="true"]')) error.hidden = true;
  });

  back.addEventListener('click', () => show(Math.max(0, current - 1)));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate(steps[current])) return;
    if (current < steps.length - 1) return show(current + 1);

    const data = new FormData(form);
    const answers: Answers = {};
    for (const [k, v] of data) if (k !== 'setor') answers[k] = Number(v);
    const sector = String(data.get('setor') ?? '');
    const porteInput = form.querySelector<HTMLInputElement>('input[name="porte"]:checked');
    const porte = porteInput?.closest('label')?.textContent?.trim() ?? '';
    const result = score(answers, sector);
    last = { result, sector, porte };
    render(result);
    form.hidden = true;
    resultEl.hidden = false;
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    resultEl.querySelector<HTMLElement>('#res-title')?.focus({ preventScroll: true });
  });

  /* ---------- result ---------- */
  const q = <T extends HTMLElement = HTMLElement>(sel: string) => resultEl.querySelector<T>(sel)!;
  const toneOf = (n: number) => (n < 40 ? 'danger' : n < 70 ? 'alert' : 'ok');

  function render(r: Result) {
    q('[data-r-date]').textContent = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

    const urgent = q('[data-r-urgent]');
    urgent.hidden = !r.incidentOngoing;
    q<HTMLAnchorElement>('[data-r-urgent-link]').href = waUrl('Olá, estamos com um incidente de segurança em andamento e precisamos de ajuda.');

    q('[data-r-maturity]').textContent = String(r.maturity);
    q('[data-r-maturity-level]').textContent = `Nível ${r.maturityLevel.level} de 5 · ${r.maturityLevel.name}`;
    q('[data-r-maturity-text]').textContent = r.maturityLevel.text;
    const scale = q('[data-r-scale]');
    scale.replaceChildren(
      ...maturityLevels.map((l) => {
        const li = el('li', l.name);
        li.toggleAttribute('data-on', l.level <= r.maturityLevel.level);
        li.toggleAttribute('data-current', l.level === r.maturityLevel.level);
        return li;
      }),
    );

    q('[data-r-risk-tile]').dataset.tone = r.riskLevel.tone;
    q('[data-r-risk-level]').textContent = r.riskLevel.name;
    q('[data-r-risk]').textContent = String(r.risk);
    q('[data-r-exposure]').textContent = String(r.exposure);
    q('[data-r-risk-text]').textContent = r.riskLevel.text;

    q('[data-r-domains]').replaceChildren(
      ...r.domains.map((d) => {
        const li = el('li');
        const meta = el('div', undefined, 'bar__meta');
        meta.append(el('span', d.name), el('span', `${d.score}/100`));
        const track = el('div', undefined, 'bar__track');
        const fill = el('span', undefined, 'bar__fill');
        fill.style.width = `${Math.max(d.score, 2)}%`;
        fill.dataset.tone = toneOf(d.score);
        track.append(fill);
        li.append(meta, track);
        return li;
      }),
    );
    const unknown = q('[data-r-unknown]');
    unknown.hidden = r.unknownCount === 0;
    unknown.textContent =
      r.unknownCount === 1
        ? 'Você marcou “Não sei” em 1 pergunta. Ela conta como lacuna: um controle que ninguém confirma não protege.'
        : `Você marcou “Não sei” em ${r.unknownCount} perguntas. Elas contam como lacuna: um controle que ninguém confirma não protege.`;

    q('[data-r-crit-block]').hidden = r.criticals.length === 0;
    q('[data-r-criticals]').replaceChildren(
      ...r.criticals.map((g) => {
        const li = el('li');
        li.append(el('strong', g.critical), el('span', `${g.domain} · resposta: ${g.answer}`));
        return li;
      }),
    );

    const wins = r.quickWins.length
      ? r.quickWins.map((g) => {
          const li = el('li');
          const title = el('strong', g.fix);
          li.append(title, el('span', `${g.domain} · hoje: ${g.answer}`));
          if (g.critical) {
            const tag = el('em', ' (crítico)');
            title.append(tag);
          }
          return li;
        })
      : [el('li', 'Nenhuma lacuna grave nas respostas. Mantenha a rotina e verifique os controles com evidências.')];
    q('[data-r-wins]').replaceChildren(...wins);

    q('[data-r-services]').replaceChildren(
      ...r.services.map((p, i) => {
        const s = services.find((x) => x.slug === p.slug)!;
        const li = el('li');
        li.toggleAttribute('data-urgent', !!p.urgent);
        const n = el('span', String(i + 1).padStart(2, '0'), 'svc__n');
        n.setAttribute('aria-hidden', 'true');
        const link = el('a', `Ver ${s.name}`, 'more');
        link.href = serviceHref(s);
        li.append(n, el('span', p.urgent ? 'Agora' : s.format, 'svc__format'), el('h4', s.name), el('p', p.why), link);
        return li;
      }),
    );
  }

  /* ---------- send, print, restart ---------- */
  const waUrl = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

  const sendForm = q<HTMLFormElement>('[data-diag-send]');
  const sendError = q('[data-send-error]');
  sendForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!last) return;
    const data = new FormData(sendForm);
    const get = (k: string) => String(data.get(k) ?? '').trim();
    let ok = true;
    ['nome', 'empresa'].forEach((k) => {
      const field = sendForm.elements.namedItem(k) as HTMLInputElement | null;
      const empty = !get(k);
      field?.setAttribute('aria-invalid', String(empty));
      if (empty) ok = false;
    });
    sendError.hidden = ok;
    if (!ok) {
      sendForm.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    const { result: r, sector, porte } = last;
    const sectorName = sectors.find((s) => s.slug === sector)?.name ?? (sector === 'outro' ? 'Outro' : '');
    const lines = [
      `Olá! Sou ${get('nome')}, da ${get('empresa')}. Fiz o diagnóstico de segurança no site.`,
      '',
      sectorName && `Setor: ${sectorName}`,
      porte && `Funcionários: ${porte}`,
      `Maturidade: ${r.maturity}/100 (nível ${r.maturityLevel.level}, ${r.maturityLevel.name})`,
      `Risco: ${r.riskLevel.name} (${r.risk}/100)`,
      '',
      'Por camada:',
      ...r.domains.map((d) => `- ${d.name}: ${d.score}`),
      r.criticals.length > 0 && '',
      r.criticals.length > 0 && 'Lacunas críticas:',
      ...r.criticals.map((g) => `- ${g.critical}`),
      '',
      'Caminho sugerido:',
      ...r.services.map((p, i) => `${i + 1}. ${services.find((s) => s.slug === p.slug)?.name}`),
      '',
      'Gostaria de conversar sobre os próximos passos.',
    ];
    const text = lines
      .filter((l): l is string => typeof l === 'string')
      .join('\n')
      .replace(/\n{3,}/g, '\n\n');
    window.open(waUrl(text), '_blank', 'noopener');
  });

  q('[data-diag-print]').addEventListener('click', () => window.print());

  q('[data-diag-restart]').addEventListener('click', () => {
    form.reset();
    form.querySelectorAll('[aria-invalid]').forEach((n) => n.removeAttribute('aria-invalid'));
    last = null;
    resultEl.hidden = true;
    form.hidden = false;
    show(0);
  });

  // Enhance: one step at a time, with progress.
  form.setAttribute('data-ready', '');
  progress.hidden = false;
  show(0, false);
}
