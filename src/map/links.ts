import type { Link } from '../data/types';
import { getMovement } from '../data';
import type { TerritoryLayout } from './layout';
import { hashSeed } from '../lib/prng';

export interface LinkGeometry {
  link: Link;
  /** Bézier cubique M … C … */
  d: string;
  /** Point milieu approximatif (t = 0.5) pour la barre des réactions et le placement. */
  mid: { x: number; y: number };
  /** Angle de la tangente au milieu (pour la barre perpendiculaire). */
  midAngle: number;
  /** Angle de la tangente en t = 1 (pour la pointe de flèche dessinée). */
  endAngle: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function bezierMid(p0: [number, number], c1: [number, number], c2: [number, number], p1: [number, number]) {
  const t = 0.5;
  const u = 1 - t;
  const x = u * u * u * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p1[0];
  const y = u * u * u * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p1[1];
  // tangente
  const dx = 3 * u * u * (c1[0] - p0[0]) + 6 * u * t * (c2[0] - c1[0]) + 3 * t * t * (p1[0] - c2[0]);
  const dy = 3 * u * u * (c1[1] - p0[1]) + 6 * u * t * (c2[1] - c1[1]) + 3 * t * t * (p1[1] - c2[1]);
  return { x, y, angle: Math.atan2(dy, dx) };
}

/** Géométrie d'un lien : Bézier entre les bords des territoires, courbure ∝ distance. */
export function linkGeometry(link: Link, a: TerritoryLayout, b: TerritoryLayout): LinkGeometry {
  let dx = b.x - a.x;
  let dy = b.y - a.y;
  let d = Math.hypot(dx, dy);
  if (d < 1e-6) {
    dx = 1;
    dy = 0;
    d = 1;
  }
  const ux = dx / d;
  const uy = dy / d;
  const x1 = a.x + ux * a.r;
  const y1 = a.y + uy * a.r;
  const x2 = b.x - ux * b.r;
  const y2 = b.y - uy * b.r;
  // côté déterministe selon le triplet
  const side = hashSeed(`${link.source}|${link.target}|${link.kind}`) % 2 === 0 ? 1 : -1;
  const bend = 0.18 * d * side;
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  // perpendiculaire
  const px = -uy;
  const py = ux;
  const c1x = x1 + (cx - x1) * 0.6 + px * bend;
  const c1y = y1 + (cy - y1) * 0.6 + py * bend;
  const c2x = x2 + (cx - x2) * 0.6 + px * bend;
  const c2y = y2 + (cy - y2) * 0.6 + py * bend;
  const mid = bezierMid([x1, y1], [c1x, c1y], [c2x, c2y], [x2, y2]);
  const endAngle = Math.atan2(y2 - c2y, x2 - c2x);
  return {
    link,
    d: `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`,
    mid: { x: mid.x, y: mid.y },
    midAngle: mid.angle,
    endAngle,
    x1,
    y1,
    x2,
    y2,
  };
}

/** Lien transversal : les deux mouvements appartiennent à des ères différentes. */
export function isTransversal(l: Link): boolean {
  const a = getMovement(l.source);
  const b = getMovement(l.target);
  return !!a && !!b && a.era !== b.era;
}

export interface ActiveLink extends Link {
  isOut: boolean;
}

/** Liens actifs pour un mouvement donné : sortants et entrants. */
export function linksFor(movementId: string, links: Link[]): ActiveLink[] {
  const out: ActiveLink[] = [];
  for (const l of links) {
    if (l.source === movementId) out.push({ ...l, isOut: true });
    else if (l.target === movementId) out.push({ ...l, isOut: false });
  }
  return out;
}


