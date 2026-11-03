/**
 * Live feed beside the shield globe: every threat the globe blocks becomes a
 * new row at the top. Keeps four rows. Static under reduced motion.
 */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll<HTMLElement>('[data-feed]').forEach((feed) => {
  const host = feed.closest<HTMLElement>('[data-globe-host]');
  const list = feed.querySelector<HTMLOListElement>('ol');
  const counter = feed.querySelector<HTMLElement>('[data-feed-count]');
  if (!host || !list || reduce) return;
  let minutes = 14 * 60 + 32;
  let count = Number(counter?.textContent ?? 0);

  host.addEventListener('threat-blocked', (e) => {
    const name = (e as CustomEvent<{ name: string }>).detail.name;
    minutes += 1 + Math.floor(Math.random() * 3);
    const hh = String(Math.floor(minutes / 60) % 24).padStart(2, '0');
    const mm = String(minutes % 60).padStart(2, '0');
    const li = document.createElement('li');
    li.className = 'is-new';
    li.innerHTML = `<time>${hh}:${mm}</time><span class="what"></span><span class="ok">Bloqueado</span>`;
    li.querySelector('.what')!.textContent = name;
    list.prepend(li);
    while (list.children.length > 4) list.lastElementChild?.remove();
    count += 1;
    if (counter) counter.textContent = String(count);
  });
});
