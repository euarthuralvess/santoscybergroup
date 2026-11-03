/**
 * Contact form without a backend: builds a WhatsApp message from the fields
 * and opens it. Nothing is sent to or stored by this site.
 */
const form = document.querySelector<HTMLFormElement>('[data-wa-form]');

if (form) {
  const error = form.querySelector<HTMLElement>('[data-wa-error]');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const get = (k: string) => String(data.get(k) ?? '').trim();
    const required = ['nome', 'empresa'];
    let ok = true;
    required.forEach((k) => {
      const field = form.elements.namedItem(k) as HTMLInputElement | null;
      const empty = !get(k);
      field?.setAttribute('aria-invalid', String(empty));
      if (empty) ok = false;
    });
    if (error) error.hidden = ok;
    if (!ok) {
      (form.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.focus();
      return;
    }
    const lines = [
      `Olá! Sou ${get('nome')}, da ${get('empresa')}.`,
      get('setor') && `Setor: ${get('setor')}`,
      get('porte') && `Funcionários: ${get('porte')}`,
      `Assunto: ${get('assunto')}`,
      get('mensagem') && `\n${get('mensagem')}`,
    ].filter(Boolean);
    const url = `https://wa.me/${form.dataset.waNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener');
  });
}
