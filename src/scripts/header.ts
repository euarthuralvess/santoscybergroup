/** Mobile menu: open, close on Escape, close when the viewport grows. */
const header = document.querySelector<HTMLElement>('[data-header]');
const toggle = header?.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menu = header?.querySelector<HTMLElement>('[data-menu]');

if (header && toggle && menu) {
  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.hidden = !open;
    document.documentElement.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 981px)').addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });
}
