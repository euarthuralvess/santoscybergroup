/**
 * Shield globe.
 *
 * - A sphere of connected nodes (the company's network) turns slowly; blue
 *   signals travel on arcs between asset nodes.
 * - A shield surrounds it. Red threats arrive from outside, hit the shield
 *   and are blocked: the impact flashes on the shield and a
 *   `threat-blocked` event is dispatched for the live feed.
 * - The pointer tilts the globe.
 *
 * The globe is centred on [data-globe-anchor]. Paused off screen; one static
 * frame under prefers-reduced-motion.
 */

type V3 = [number, number, number];
type Threat = { a0: number; d0: number; a1: number; t: number; dur: number; bend: number; name: string };
type Impact = { a: number; t: number };
type Arc = { from: number; to: number; pts: V3[]; pulse: number; speed: number };

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const THREATS = [
  'Tentativa de acesso remoto',
  'Varredura de portas',
  'E-mail falso com anexo',
  'Login de outro país',
  'Senha vazada testada',
  'Acesso a painel exposto',
  'Download de arquivo malicioso',
];

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const norm = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / l, v[1] / l, v[2] / l];
};

function slerpArc(a: V3, b: V3, steps = 28, lift = 0.22): V3[] {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const om = Math.acos(dot);
  const so = Math.sin(om) || 1;
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const k1 = Math.sin((1 - t) * om) / so;
    const k2 = Math.sin(t * om) / so;
    const h = 1 + lift * Math.sin(Math.PI * t);
    return [(a[0] * k1 + b[0] * k2) * h, (a[1] * k1 + b[1] * k2) * h, (a[2] * k1 + b[2] * k2) * h];
  });
}

function init(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const host = canvas.closest<HTMLElement>('[data-globe-host]') ?? canvas.parentElement!;
  const anchor = host.querySelector<HTMLElement>('[data-globe-anchor]');
  const rand = rng(11);

  // Fibonacci sphere
  const N = Number(canvas.dataset.points ?? 420);
  const pts: V3[] = Array.from({ length: N }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / N;
    const r = Math.sqrt(1 - y * y);
    const th = i * Math.PI * (3 - Math.sqrt(5));
    return [Math.cos(th) * r, y, Math.sin(th) * r];
  });
  // mesh: each point to its 2 nearest neighbours
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  pts.forEach((p, i) => {
    pts
      .map((q, j) => ({ j, d: (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2 + (q[2] - p[2]) ** 2 }))
      .filter((o) => o.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 4)
      .forEach(({ j }) => {
        const k = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(k)) {
          seen.add(k);
          edges.push([i, j]);
        }
      });
  });
  // assets and the traffic between them
  const assets = Array.from({ length: 12 }, () => Math.floor(rand() * N));
  const arcs: Arc[] = [];
  const angle = (a: V3, b: V3) => Math.acos(Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])));
  assets.forEach((a) => {
    // link each asset to its two closest assets, never across the globe
    assets
      .filter((b) => b !== a)
      .map((b) => ({ b, d: angle(pts[a], pts[b]) }))
      .filter((o) => o.d < 1.4)
      .sort((x, y) => x.d - y.d)
      .slice(0, 2)
      .forEach(({ b }) => {
        if (arcs.some((r) => (r.from === b && r.to === a) || (r.from === a && r.to === b))) return;
        arcs.push({ from: a, to: b, pts: slerpArc(norm(pts[a]), norm(pts[b]), 28, 0.14), pulse: rand(), speed: 0.00018 + rand() * 0.00018 });
      });
  });

  let w = 0;
  let h = 0;
  let cx = 0;
  let cy = 0;
  let R = 100;
  let rot = 0.6;
  let tilt = 0.32;
  let tiltGoal = 0.32;
  let spin = 1;
  let running = false;
  let last = performance.now();
  let nextThreat = 900;
  let clock = 0;
  let threats: Threat[] = [];
  let impacts: Impact[] = [];
  let named = 0;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (anchor) {
      const a = anchor.getBoundingClientRect();
      cx = a.left - rect.left + a.width / 2;
      cy = a.top - rect.top + a.height / 2;
      R = Math.min(a.width, a.height) * 0.4;
    } else {
      cx = w * 0.7;
      cy = h * 0.5;
      R = Math.min(w, h) * 0.3;
    }
    frame(0);
  };

  const project = (p: V3) => {
    const ca = Math.cos(rot);
    const sa = Math.sin(rot);
    const x1 = p[0] * ca + p[2] * sa;
    const z1 = -p[0] * sa + p[2] * ca;
    const ct = Math.cos(tilt);
    const st = Math.sin(tilt);
    const y2 = p[1] * ct - z1 * st;
    const z2 = p[1] * st + z1 * ct;
    const s = 1 + z2 * 0.12;
    return { x: cx + x1 * R * s, y: cy + y2 * R * s, z: z2 };
  };

  const shieldR = () => R * 1.2;

  const spawnThreat = () => {
    // threats come from the right half, top and bottom, never across the copy
    const a1 = -Math.PI * 0.62 + rand() * Math.PI * 1.25;
    threats.push({
      a0: a1 + (rand() - 0.5) * 0.9,
      d0: R * (2.3 + rand() * 0.8),
      a1,
      t: 0,
      dur: 1100 + rand() * 600,
      bend: (rand() - 0.5) * 0.9,
      name: THREATS[named++ % THREATS.length],
    });
  };

  const threatPos = (th: Threat, t: number) => {
    const sx = cx + Math.cos(th.a0) * th.d0;
    const sy = cy + Math.sin(th.a0) * th.d0;
    const ex = cx + Math.cos(th.a1) * shieldR();
    const ey = cy + Math.sin(th.a1) * shieldR();
    const mx = (sx + ex) / 2 + (ey - sy) * th.bend;
    const my = (sy + ey) / 2 - (ex - sx) * th.bend;
    const u = 1 - t;
    return [u * u * sx + 2 * u * t * mx + t * t * ex, u * u * sy + 2 * u * t * my + t * t * ey] as const;
  };

  function frame(dt: number) {
    if (dt) {
      rot += dt * 0.00011 * spin;
      tilt += (tiltGoal - tilt) * 0.05;
      clock += dt;
      if (clock > nextThreat) {
        clock = 0;
        nextThreat = 1500 + rand() * 1300;
        spawnThreat();
      }
      threats.forEach((th) => (th.t += dt / th.dur));
      threats = threats.filter((th) => {
        if (th.t < 1) return true;
        impacts.push({ a: th.a1, t: 0 });
        host.dispatchEvent(new CustomEvent('threat-blocked', { detail: { name: th.name } }));
        return false;
      });
      impacts.forEach((im) => (im.t += dt / 900));
      impacts = impacts.filter((im) => im.t < 1);
      arcs.forEach((a) => (a.pulse = (a.pulse + dt * a.speed) % 1));
    }

    ctx!.clearRect(0, 0, w, h);

    // halo behind the globe
    const halo = ctx!.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.9);
    halo.addColorStop(0, 'rgba(47, 111, 228, 0.28)');
    halo.addColorStop(0.55, 'rgba(47, 111, 228, 0.08)');
    halo.addColorStop(1, 'rgba(47, 111, 228, 0)');
    ctx!.fillStyle = halo;
    ctx!.fillRect(cx - R * 2, cy - R * 2, R * 4, R * 4);

    // globe body
    const body = ctx!.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
    body.addColorStop(0, 'rgba(40, 70, 170, 0.55)');
    body.addColorStop(1, 'rgba(8, 16, 60, 0.85)');
    ctx!.fillStyle = body;
    ctx!.beginPath();
    ctx!.arc(cx, cy, R, 0, Math.PI * 2);
    ctx!.fill();

    const P = pts.map(project);

    // mesh
    ctx!.lineWidth = 0.8;
    edges.forEach(([a, b]) => {
      const d = (P[a].z + P[b].z) / 2;
      const alpha = d > 0 ? 0.05 + d * 0.22 : 0.015 + (1 + d) * 0.03;
      ctx!.strokeStyle = `rgba(120, 170, 255, ${alpha})`;
      ctx!.beginPath();
      ctx!.moveTo(P[a].x, P[a].y);
      ctx!.lineTo(P[b].x, P[b].y);
      ctx!.stroke();
    });

    // nodes
    P.forEach((p) => {
      const d = (p.z + 1) / 2;
      ctx!.fillStyle = `rgba(170, 200, 255, ${0.12 + d * 0.75})`;
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, 0.5 + d * 1.3, 0, Math.PI * 2);
      ctx!.fill();
    });

    // traffic arcs between assets
    arcs.forEach((arc) => {
      const AP = arc.pts.map(project);
      ctx!.lineWidth = 1;
      for (let i = 1; i < AP.length; i++) {
        const d = (AP[i].z + AP[i - 1].z) / 2;
        if (d < -0.15) continue;
        ctx!.strokeStyle = `rgba(110, 170, 255, ${0.1 + Math.max(0, d) * 0.35})`;
        ctx!.beginPath();
        ctx!.moveTo(AP[i - 1].x, AP[i - 1].y);
        ctx!.lineTo(AP[i].x, AP[i].y);
        ctx!.stroke();
      }
      const idx = Math.floor(arc.pulse * (AP.length - 1));
      const p = AP[idx];
      if (p.z > -0.1) {
        const g = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, 10);
        g.addColorStop(0, 'rgba(160, 205, 255, 0.95)');
        g.addColorStop(1, 'rgba(160, 205, 255, 0)');
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 10, 0, Math.PI * 2);
        ctx!.fill();
      }
    });

    // asset nodes
    assets.forEach((i) => {
      const p = P[i];
      if (p.z < -0.05) return;
      const d = (p.z + 1) / 2;
      ctx!.strokeStyle = `rgba(150, 200, 255, ${0.25 + d * 0.6})`;
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, 4 + d * 2, 0, Math.PI * 2);
      ctx!.stroke();
      ctx!.fillStyle = `rgba(220, 235, 255, ${0.5 + d * 0.5})`;
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
      ctx!.fill();
    });

    // shield
    const sr = shieldR();
    const shield = ctx!.createRadialGradient(cx, cy, sr * 0.92, cx, cy, sr * 1.04);
    shield.addColorStop(0, 'rgba(120, 180, 255, 0)');
    shield.addColorStop(0.75, 'rgba(120, 180, 255, 0.07)');
    shield.addColorStop(1, 'rgba(120, 180, 255, 0)');
    ctx!.fillStyle = shield;
    ctx!.beginPath();
    ctx!.arc(cx, cy, sr * 1.05, 0, Math.PI * 2);
    ctx!.fill();
    ctx!.strokeStyle = 'rgba(120, 180, 255, 0.22)';
    ctx!.lineWidth = 1;
    ctx!.setLineDash([2, 6]);
    ctx!.beginPath();
    ctx!.arc(cx, cy, sr, 0, Math.PI * 2);
    ctx!.stroke();
    ctx!.setLineDash([]);

    // impacts on the shield
    impacts.forEach((im) => {
      const k = 1 - im.t;
      ctx!.strokeStyle = `rgba(150, 205, 255, ${0.95 * k})`;
      ctx!.lineWidth = 2.2;
      ctx!.beginPath();
      ctx!.arc(cx, cy, sr, im.a - 0.32 * (0.4 + im.t), im.a + 0.32 * (0.4 + im.t));
      ctx!.stroke();
      const ix = cx + Math.cos(im.a) * sr;
      const iy = cy + Math.sin(im.a) * sr;
      const g = ctx!.createRadialGradient(ix, iy, 0, ix, iy, 26 + im.t * 20);
      g.addColorStop(0, `rgba(190, 220, 255, ${0.7 * k})`);
      g.addColorStop(1, 'rgba(190, 220, 255, 0)');
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.arc(ix, iy, 26 + im.t * 20, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.strokeStyle = `rgba(255, 110, 125, ${0.6 * k})`;
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.arc(ix, iy, 4 + im.t * 22, 0, Math.PI * 2);
      ctx!.stroke();
    });
    ctx!.lineWidth = 1;

    // incoming threats
    threats.forEach((th) => {
      for (let k = 0; k < 14; k++) {
        const t = th.t - k * 0.018;
        if (t < 0) break;
        const [x, y] = threatPos(th, t);
        ctx!.fillStyle = `rgba(255, 95, 110, ${(1 - k / 14) * 0.85})`;
        ctx!.beginPath();
        ctx!.arc(x, y, 2.2 * (1 - k / 18), 0, Math.PI * 2);
        ctx!.fill();
      }
      const [hx, hy] = threatPos(th, th.t);
      const g = ctx!.createRadialGradient(hx, hy, 0, hx, hy, 14);
      g.addColorStop(0, 'rgba(255, 95, 110, 0.55)');
      g.addColorStop(1, 'rgba(255, 95, 110, 0)');
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.arc(hx, hy, 14, 0, Math.PI * 2);
      ctx!.fill();
    });
  }

  const loop = (t: number) => {
    if (!running) return;
    frame(Math.min(50, t - last));
    last = t;
    requestAnimationFrame(loop);
  };
  const start = () => {
    if (running || reduce) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(loop);
  };
  const stop = () => (running = false);

  new ResizeObserver(resize).observe(canvas);
  if (anchor) new ResizeObserver(resize).observe(anchor);
  new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  host.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = host.getBoundingClientRect();
    const py = (e.clientY - r.top) / r.height - 0.5;
    const px = (e.clientX - r.left) / r.width - 0.5;
    tiltGoal = 0.32 + py * 0.5;
    spin = 1 + px * 2.2;
  });
  host.addEventListener('pointerleave', () => {
    tiltGoal = 0.32;
    spin = 1;
  });
  resize();
}

document.querySelectorAll<HTMLCanvasElement>('canvas[data-globe]').forEach(init);
export {};
