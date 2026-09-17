import type { AtlasLayout } from './layout';
import type { Bounds } from './controller';
import type { Selection } from '../state/store';
import { MOVEMENTS } from '../data';

/** Mouvement d'appartenance d'une sélection. */
export function movementOf(sel: Selection): string | null {
  if (sel.kind === 'mouvement') return sel.id;
  for (const m of MOVEMENTS) {
    if (sel.kind === 'tendance' && m.tendances.some((t) => t.id === sel.id)) return m.id;
    if (sel.kind === 'auteur' && m.auteurs.some((a) => a.id === sel.id)) return m.id;
    if (sel.kind === 'oeuvre' && m.oeuvres.some((o) => o.id === sel.id)) return m.id;
  }
  return null;
}

/** Emprise idéale d'un nœud pour le fly-to. */
export function boundsFor(sel: Selection, layout: AtlasLayout): Bounds | null {
  const mid = movementOf(sel);
  const t = mid ? layout.byId.get(mid) : undefined;
  if (sel.kind === 'mouvement') {
    if (!t) return null;
    const m = t.r * 1.15;
    return { x0: t.x - m, y0: t.y - m, x1: t.x + m, y1: t.y + m };
  }
  if (!t) return null;
  const pos = layout.childPos.get(sel.id);
  if (!pos) return { x0: t.x - t.r, y0: t.y - t.r, x1: t.x + t.r, y1: t.y + t.r };
  const pad = sel.kind === 'tendance' ? t.r * 0.5 : sel.kind === 'auteur' ? t.r * 0.24 : t.r * 0.16;
  return { x0: pos.x - pad, y0: pos.y - pad, x1: pos.x + pad, y1: pos.y + pad };
}
