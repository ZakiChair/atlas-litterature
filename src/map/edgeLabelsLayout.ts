import { ERA_BANDS } from '../data/eras';
import type { Domaine, Era } from '../data/types';
import type { ViewTransform } from './viewStore';

const FONT = 10.5;
/** largeur moyenne d'une capitale Cormorant espacée de 0.16em, à FONT px */
const CHAR_W = FONT * 0.76;
const PAD = 12;
/** dépassement toléré d'un libellé hors de sa bande (fraction de sa longueur) */
const OVERFLOW = 0.15;
export const BOTTOM_GUTTER = 48;
export const LEFT_GUTTER = 26;
/** hauteur réservée en bas à gauche (indicateur de niveau au-dessus de la gouttière) */
const CORNER_RESERVED = 100;

export interface EdgeLabel {
  id: string;
  /** centre du libellé le long de l'axe (px écran) */
  pos: number;
  lines: string[];
}

/**
 * Place un libellé de longueur `len` dans l'intervalle visible [a, b] : centré si
 * possible, sinon décalé après le libellé précédent (`lastEnd`). Un dépassement
 * de OVERFLOW·len hors de l'intervalle est toléré ; au-delà, le libellé est masqué.
 */
export function placeLabel(a: number, b: number, len: number, lastEnd: number): number | null {
  const slack = OVERFLOW * len;
  if (b - a + 2 * slack < len) return null;
  let c = (a + b) / 2;
  if (c - len / 2 < lastEnd + 4) c = lastEnd + 4 + len / 2;
  if (c + len / 2 > b + slack) return null;
  return c;
}

/**
 * Libellés de domaines (axe vertical). Un libellé n'est gardé que si la portion
 * visible de sa bande peut à peu près le contenir et s'il ne recouvre pas le précédent.
 */
export function domaineLabels(v: ViewTransform, domaines: Domaine[]): EdgeLabel[] {
  const out: EdgeLabel[] = [];
  let lastEnd = -Infinity;
  for (const d of domaines) {
    const text = (d.shortName ?? d.name).toUpperCase();
    const len = text.length * CHAR_W + PAD;
    const y0 = Math.max(0, v.y + d.y0 * v.k);
    const y1 = Math.min(v.height - CORNER_RESERVED, v.y + d.y1 * v.k);
    const c = placeLabel(y0, y1, len, lastEnd);
    if (c === null || c + len / 2 > v.height - CORNER_RESERVED) continue;
    lastEnd = c + len / 2;
    out.push({ id: d.id, pos: c, lines: [text] });
  }
  return out;
}

/** Libellés d'ères (axe horizontal), centrés sur la portion visible de la bande. */
export function eraLabels(v: ViewTransform, eras: Era[], today: string): EdgeLabel[] {
  const eraById = new Map(eras.map((e) => [e.id, e]));
  const out: EdgeLabel[] = [];
  let lastEnd = -Infinity;
  for (const band of ERA_BANDS) {
    const era = eraById.get(band.era);
    if (!era) continue;
    const name = era.name.toUpperCase();
    const range = `${era.period.start} – ${era.period.end ?? today}`;
    const len = Math.max(name.length * CHAR_W * 1.15, range.length * CHAR_W * 0.9) + PAD + 4;
    const x0 = Math.max(LEFT_GUTTER, v.x + band.x0 * v.k);
    const x1 = Math.min(v.width, v.x + band.x1 * v.k);
    const c = placeLabel(x0, x1, len, lastEnd);
    if (c === null || c + len / 2 > v.width) continue;
    lastEnd = c + len / 2;
    out.push({ id: band.era, pos: c, lines: [name, range] });
  }
  return out;
}
