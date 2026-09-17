import * as d3 from 'd3';
import { MAP_SIZE } from '../data/eras';
import type { Movement } from '../data/types';
import { seededRandom } from '../lib/prng';

const BASE_R: Record<number, number> = { 3: 300, 2: 235, 1: 175 };
/** marge de séparation entre deux cercles voisins (chaque côté), unités carte */
export const RELAX_MARGIN = 24;
const MAP_MARGIN = 40;
const CHILD_MAX = 0.85;

export function baseRadius(m: Movement): number {
  const r = BASE_R[m.map.size] ?? BASE_R[1];
  const extra = Math.min(0.25, Math.max(0, Math.floor((m.oeuvres.length - 8) / 4)) * 0.08);
  return r * (1 + extra);
}

/** Chemin organique déterministe : 12-16 points, rayon bruité, Catmull-Rom fermé. */
export function organicPath(cx: number, cy: number, r: number, seed: string, wobble = 0.18): string {
  const rand = seededRandom(seed);
  const n = 12 + Math.floor(rand() * 5);
  const startAngle = rand() * Math.PI * 2;
  // bruit basse fréquence : mélange de 2 harmoniques + jitter
  const ph1 = rand() * Math.PI * 2;
  const ph2 = rand() * Math.PI * 2;
  const amp1 = wobble * 0.55;
  const amp2 = wobble * 0.45;
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = startAngle + (i / n) * Math.PI * 2;
    const jit = (rand() - 0.5) * wobble * 0.6;
    const f = 1 - wobble + amp1 * (0.5 + 0.5 * Math.sin(2 * a + ph1)) + amp2 * (0.5 + 0.5 * Math.sin(3 * a + ph2)) + jit;
    const rr = r * f;
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
  }
  const line = d3.line<[number, number]>().curve(d3.curveCatmullRomClosed.alpha(0.5));
  return line(pts) ?? '';
}

export interface ChildPos {
  kind: 'tendance' | 'auteur' | 'oeuvre';
  id: string;
  x: number;
  y: number;
  /** ancrage du libellé (œuvres en éventail : à droite, en dessous, à gauche du marqueur) */
  anchor?: 'start' | 'middle' | 'end';
  /** auteurs : libellé au-dessus ou au-dessous du marqueur, à l'opposé du centre de la tendance */
  vside?: 'above' | 'below';
}

export interface TerritoryLayout {
  id: string;
  x: number;
  y: number;
  r: number;
  path: string;
  isoPath: string;
  children: ChildPos[];
}

export interface AtlasLayout {
  territories: TerritoryLayout[];
  byId: Map<string, TerritoryLayout>;
  childPos: Map<string, ChildPos>;
}

interface Circle {
  id: string;
  x: number;
  y: number;
  r: number;
}

/** Relaxation déterministe : écarte les cercles (r + marge) par itérations amorties. */
export function relaxCircles(circles: Circle[], iterations = 300): void {
  const clamp = () => {
    for (const c of circles) {
      c.x = Math.min(MAP_SIZE.width - MAP_MARGIN - c.r, Math.max(MAP_MARGIN + c.r, c.x));
      c.y = Math.min(MAP_SIZE.height - MAP_MARGIN - c.r, Math.max(MAP_MARGIN + c.r, c.y));
    }
  };
  const pass = (alpha: number): boolean => {
    let moved = false;
    for (let i = 0; i < circles.length; i++) {
      for (let j = i + 1; j < circles.length; j++) {
        const a = circles[i];
        const b = circles[j];
        const minD = a.r + RELAX_MARGIN + b.r + RELAX_MARGIN;
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let d = Math.hypot(dx, dy);
        if (d < minD) {
          if (d < 1e-6) {
            dx = (i - j) * 0.01 || 0.01;
            dy = 0.01;
            d = Math.hypot(dx, dy);
          }
          const push = ((minD - d) / d) * 0.5 * alpha;
          a.x -= dx * push;
          a.y -= dy * push;
          b.x += dx * push;
          b.y += dy * push;
          moved = true;
        }
      }
    }
    return moved;
  };
  for (let iter = 0; iter < iterations; iter++) {
    if (!pass(1 - iter / iterations)) {
      clamp();
      return;
    }
    clamp();
  }
  // phase finale : séparation exacte des résidus
  for (let iter = 0; iter < 150; iter++) {
    if (!pass(1)) break;
    clamp();
  }
}

function clampChild(cx: number, cy: number, r: number, x: number, y: number): [number, number] {
  const dx = x - cx;
  const dy = y - cy;
  const d = Math.hypot(dx, dy);
  const max = r * CHILD_MAX;
  if (d <= max || d < 1e-6) return [x, y];
  const k = max / d;
  return [cx + dx * k, cy + dy * k];
}

/** Boîte d'un libellé d'auteur (unités carte, calibrée pour k ≈ 1 au niveau « Auteurs »). */
const AUT_BOX = { w: 118, h: 42, dy: 24 };
/** Boîte du libellé d'une tendance aux niveaux 2-3 (décalé sous le centre du blob). */
const TEND_BOX = { w: 110, h: 34, dy: 22 };

/**
 * Écarte les libellés d'auteurs entre eux et des libellés de tendances, par
 * répulsion de boîtes le long de l'axe de moindre recouvrement. Déterministe.
 */
export function separateAuteurLabels(auts: ChildPos[], tendances: { x: number; y: number }[], cx: number, cy: number, r: number): void {
  const boxY = (c: ChildPos) => c.y + (c.vside === 'below' ? AUT_BOX.dy : -AUT_BOX.dy);
  for (let iter = 0; iter < 60; iter++) {
    let moved = false;
    for (let i = 0; i < auts.length; i++) {
      for (let j = i + 1; j < auts.length; j++) {
        const a = auts[i];
        const b = auts[j];
        const dx = b.x - a.x;
        const dy = boxY(b) - boxY(a);
        const ox = AUT_BOX.w - Math.abs(dx);
        const oy = AUT_BOX.h - Math.abs(dy);
        if (ox <= 0 || oy <= 0) continue;
        moved = true;
        if (ox < oy) {
          const sgn = dx >= 0 ? 1 : -1;
          a.x -= (sgn * ox) / 2;
          b.x += (sgn * ox) / 2;
        } else {
          const sgn = dy >= 0 ? 1 : -1;
          a.y -= (sgn * oy) / 2;
          b.y += (sgn * oy) / 2;
        }
      }
      // libellés de tendances : obstacles fixes
      for (const sp of tendances) {
        const a = auts[i];
        const dx = a.x - sp.x;
        const dy = boxY(a) - (sp.y + TEND_BOX.dy);
        const ox = (AUT_BOX.w + TEND_BOX.w) / 2 - Math.abs(dx);
        const oy = (AUT_BOX.h + TEND_BOX.h) / 2 - Math.abs(dy);
        if (ox <= 0 || oy <= 0) continue;
        moved = true;
        if (ox < oy) a.x += (dx >= 0 ? 1 : -1) * ox;
        else a.y += (dy >= 0 ? 1 : -1) * oy;
      }
    }
    for (const c of auts) {
      const [x, y] = clampChild(cx, cy, r, c.x, c.y);
      c.x = x;
      c.y = y;
    }
    if (!moved) return;
  }
}

function layoutChildren(m: Movement, cx: number, cy: number, r: number): ChildPos[] {
  const rand = seededRandom(m.id + ':children');
  const children: ChildPos[] = [];
  const tendPos = new Map<string, { x: number; y: number }>();
  const autPos = new Map<string, { x: number; y: number }>();

  // tendances sur un anneau à 0.42 r
  const sStart = rand() * Math.PI * 2;
  m.tendances.forEach((t, i) => {
    const a = sStart + (i / Math.max(1, m.tendances.length)) * Math.PI * 2;
    const [x, y] = clampChild(cx, cy, r, cx + 0.42 * r * Math.cos(a), cy + 0.42 * r * Math.sin(a));
    tendPos.set(t.id, { x, y });
    children.push({ kind: 'tendance', id: t.id, x, y });
  });

  // auteurs groupés autour de leur tendance, sinon anneau 0.62 r
  const byTendance = new Map<string, Movement['auteurs']>();
  const orphans: Movement['auteurs'] = [];
  for (const a of m.auteurs) {
    if (a.tendanceId && tendPos.has(a.tendanceId)) {
      const g = byTendance.get(a.tendanceId) ?? [];
      g.push(a);
      byTendance.set(a.tendanceId, g);
    } else orphans.push(a);
  }
  const autChildren: ChildPos[] = [];
  for (const [tid, group] of byTendance) {
    const tp = tendPos.get(tid)!;
    const ti = m.tendances.findIndex((t) => t.id === tid);
    const start = (ti + 1) * 1.7 + rand() * 0.5;
    group.forEach((a, i) => {
      const ang = start + (i / Math.max(1, group.length)) * Math.PI * 2;
      const rr = (0.24 + rand() * 0.08) * r;
      const [x, y] = clampChild(cx, cy, r, tp.x + rr * Math.cos(ang), tp.y + rr * Math.sin(ang));
      autChildren.push({ kind: 'auteur', id: a.id, x, y, vside: y < tp.y ? 'above' : 'below' });
    });
  }
  const oStart = rand() * Math.PI * 2;
  orphans.forEach((a, i) => {
    const ang = oStart + (i / Math.max(1, orphans.length)) * Math.PI * 2;
    const [x, y] = clampChild(cx, cy, r, cx + 0.62 * r * Math.cos(ang), cy + 0.62 * r * Math.sin(ang));
    autChildren.push({ kind: 'auteur', id: a.id, x, y, vside: 'above' });
  });
  separateAuteurLabels(autChildren, [...tendPos.values()], cx, cy, r);
  for (const c of autChildren) {
    autPos.set(c.id, { x: c.x, y: c.y });
    children.push(c);
  }

  // œuvres autour de leur auteur, sinon de leur tendance, sinon du centre
  const oeuvresByAut = new Map<string, Movement['oeuvres']>();
  const oeuvresByTend = new Map<string, Movement['oeuvres']>();
  const oeuvresOrphan: Movement['oeuvres'] = [];
  for (const o of m.oeuvres) {
    if (o.auteurId && autPos.has(o.auteurId)) {
      const g = oeuvresByAut.get(o.auteurId) ?? [];
      g.push(o);
      oeuvresByAut.set(o.auteurId, g);
    } else if (o.tendanceId && tendPos.has(o.tendanceId)) {
      const g = oeuvresByTend.get(o.tendanceId) ?? [];
      g.push(o);
      oeuvresByTend.set(o.tendanceId, g);
    } else oeuvresOrphan.push(o);
  }
  const placeAround = (px: number, py: number, group: Movement['oeuvres'], minR: number, varR: number) => {
    const start = rand() * Math.PI * 2;
    group.forEach((o, i) => {
      const a = start + (i / Math.max(1, group.length)) * Math.PI * 2;
      const rr = (minR + rand() * varR) * r;
      const [x, y] = clampChild(cx, cy, r, px + rr * Math.cos(a), py + rr * Math.sin(a));
      children.push({ kind: 'oeuvre', id: o.id, x, y });
    });
  };
  // œuvres d'un auteur : éventail dans le demi-plan inférieur (20°–160°, y vers le bas) ;
  // le rayon croît avec le nombre d'œuvres et les libellés s'ancrent du côté extérieur
  const placeFan = (px: number, py: number, group: Movement['oeuvres']) => {
    const n = group.length;
    const rr = Math.max(0.12 * r, 30 + 9 * n);
    group.forEach((o, i) => {
      const deg = n === 1 ? 90 : 20 + (i / (n - 1)) * 140;
      const a = (deg * Math.PI) / 180;
      const [x, y] = clampChild(cx, cy, r, px + rr * Math.cos(a), py + rr * Math.sin(a));
      const anchor = deg < 75 ? 'start' : deg > 105 ? 'end' : 'middle';
      children.push({ kind: 'oeuvre', id: o.id, x, y, anchor });
    });
  };
  for (const [aid, group] of oeuvresByAut) placeFan(autPos.get(aid)!.x, autPos.get(aid)!.y, group);
  for (const [tid, group] of oeuvresByTend) placeAround(tendPos.get(tid)!.x, tendPos.get(tid)!.y, group, 0.1, 0.08);
  placeAround(cx, cy, oeuvresOrphan, 0.1, 0.5);

  return children;
}

export function computeLayout(movements: Movement[]): AtlasLayout {
  const circles: Circle[] = movements.map((m) => ({
    id: m.id,
    x: m.map.x,
    y: m.map.y,
    r: baseRadius(m),
  }));
  relaxCircles(circles);

  const territories: TerritoryLayout[] = circles.map((c) => ({
    id: c.id,
    x: c.x,
    y: c.y,
    r: c.r,
    path: organicPath(c.x, c.y, c.r, c.id),
    // même seed → même forme, rayon r + 18
    isoPath: organicPath(c.x, c.y, c.r + 18, c.id),
    children: layoutChildren(movements.find((m) => m.id === c.id)!, c.x, c.y, c.r),
  }));

  const byId = new Map(territories.map((t) => [t.id, t]));
  const childPos = new Map<string, ChildPos>();
  for (const t of territories) for (const ch of t.children) childPos.set(ch.id, ch);
  return { territories, byId, childPos };
}
