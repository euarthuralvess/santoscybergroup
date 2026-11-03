/** ARIA tabs: click, arrow keys, Home/End. Works for every [data-tabs] block. */
document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((root) => {
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const select = (tab: HTMLButtonElement, focus = false) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = root.querySelector<HTMLElement>(`#${t.getAttribute('aria-controls')}`);
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      root.dataset.interacted = '';
      select(tab);
    });
    tab.addEventListener('keydown', (e) => {
      const map: Record<string, number> = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
      if (!(e.key in map)) return;
      e.preventDefault();
      root.dataset.interacted = '';
      select(tabs[(map[e.key] + tabs.length) % tabs.length], true);
    });
  });
});
