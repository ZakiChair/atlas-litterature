import { movementOf } from '../map/bounds';
import type { Selection } from '../state/store';
import type { Auteur, Movement, Oeuvre, Tendance } from '../data/types';
import type { AtlasData } from '../i18n/localize';

export interface Resolved {
  movement: Movement;
  tendance?: Tendance;
  auteur?: Auteur;
  oeuvre?: Oeuvre;
}

export function resolveSel(sel: Selection | null, data: AtlasData): Resolved | null {
  if (!sel) return null;
  const movement = data.movementById[sel.movementId ?? movementOf(sel) ?? ''];
  if (!movement) return null;
  const out: Resolved = { movement };
  if (sel.kind === 'tendance') {
    out.tendance = movement.tendances.find((t) => t.id === sel.id);
    if (!out.tendance) return null;
  } else if (sel.kind === 'auteur') {
    out.auteur = movement.auteurs.find((a) => a.id === sel.id);
    if (!out.auteur) return null;
    out.tendance = out.auteur.tendanceId ? movement.tendances.find((t) => t.id === out.auteur!.tendanceId) : undefined;
  } else if (sel.kind === 'oeuvre') {
    out.oeuvre = movement.oeuvres.find((o) => o.id === sel.id);
    if (!out.oeuvre) return null;
    out.tendance = out.oeuvre.tendanceId ? movement.tendances.find((t) => t.id === out.oeuvre!.tendanceId) : undefined;
  }
  return out;
}
