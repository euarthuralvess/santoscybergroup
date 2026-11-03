/**
 * Constellation behind the hero: a network of assets (dots) and the paths
 * between them (curves). Points drift slowly; the ones near the pointer light
 * up. Seeded, so every visit draws the same sky. Paused when off screen.
 * Reduced motion: drawn once, no drift.
 */

type Star = { x: number; y: number; r: number; p: number; a: number; hot: number };

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function init(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const count = Number(canvas.dataset.count ?? 110);
  const bias = Number(canvas.dataset.bias ?? 0.55); // how far right the cluster sits
  const rand = rng(Number(canvas.dataset.seed ?? 7));

  const nodes: Star[] = Array.from({ length: count }, () => {
    const right = rand() < 0.82;
    const x = right ? bias + (1 - bias) * Math.pow(rand(), 0.8) * 1.05 : rand() * bias;
    return {
      x,
      y: rand(),
      r: rand() < 0.1 ? 2.4 : 0.8 + rand() * 1.2,
      p: rand() * Math.PI * 2,
      a: right ? 0.45 + rand() * 0.5 : 0.15 + rand() * 0.2,
      hot: 0,
    };
  });

  // each node links to its two nearest neighbours
  const edges: [number, number][] = [];
  nodes.forEach((n, i) => {
    const near = nodes
      .map((m, j) => ({ j, d: (m.x - n.x) ** 2 + (m.y - n.y) ** 2 }))
      .filter((o) => o.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    near.forEach((o) => {
      if (o.d < 0.03 && !edges.some(([a, b]) => (a === o.j && b === i) || (a === i && b === o.j))) edges.push([i, o.j]);
    });
  });

  let w = 0;
  let h = 0;
  let dpr = 1;
  let pointer: { x: number; y: number } | null = null;
  let running = false;
  let last = 0;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(performance.now());
  };

  const pos = (n: Star, t: number) => {
    const drift = reduce ? 0 : 5;
    return [n.x * w + Math.sin(t / 2600 + n.p) * drift, n.y * h + Math.cos(t / 3100 + n.p) * drift] as const;
  };

  function draw(t: number) {
    ctx!.clearRect(0, 0, w, h);
    const pts = nodes.map((n) => pos(n, t));

    if (pointer) {
      nodes.forEach((n, i) => {
        const d = Math.hypot(pts[i][0] - pointer!.x, pts[i][1] - pointer!.y);
        n.hot += ((d < 140 ? 1 - d / 140 : 0) - n.hot) * 0.12;
      });
    } else {
      nodes.forEach((n) => (n.hot *= 0.9));
    }

    ctx!.lineWidth = 1;
    edges.forEach(([a, b]) => {
      const [x1, y1] = pts[a];
      const [x2, y2] = pts[b];
      const heat = Math.max(nodes[a].hot, nodes[b].hot);
      const alpha = Math.min(nodes[a].a, nodes[b].a) * 0.32 + heat * 0.4;
      ctx!.strokeStyle = `rgba(120, 165, 255, ${alpha})`;
      const mx = (x1 + x2) / 2 + (y2 - y1) * 0.18;
      const my = (y1 + y2) / 2 - (x2 - x1) * 0.18;
      ctx!.beginPath();
      ctx!.moveTo(x1, y1);
      ctx!.quadraticCurveTo(mx, my, x2, y2);
      ctx!.stroke();
    });

    nodes.forEach((n, i) => {
      const [x, y] = pts[i];
      const a = Math.min(1, n.a + n.hot * 0.6);
      if (n.r > 2) {
        const g = ctx!.createRadialGradient(x, y, 0, x, y, 14);
        g.addColorStop(0, `rgba(110, 160, 255, ${0.35 * a})`);
        g.addColorStop(1, 'rgba(110, 160, 255, 0)');
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(x, y, 14, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.fillStyle = `rgba(170, 200, 255, ${a})`;
      ctx!.beginPath();
      ctx!.arc(x, y, n.r + n.hot * 1.2, 0, Math.PI * 2);
      ctx!.fill();
    });
  }

  const loop = (t: number) => {
    if (!running) return;
    if (t - last > 33) {
      draw(t);
      last = t;
    }
    requestAnimationFrame(loop);
  };
  const start = () => {
    if (running || reduce) return;
    running = true;
    requestAnimationFrame(loop);
  };
  const stop = () => {
    running = false;
  };

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  const host = canvas.parentElement ?? canvas;
  host.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    if (reduce) draw(performance.now());
  });
  host.addEventListener('pointerleave', () => {
    pointer = null;
  });
  resize();
}

document.querySelectorAll<HTMLCanvasElement>('canvas[data-constellation]').forEach(init);
export {};
