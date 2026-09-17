import type { AtlasNode, Movement } from './types';
import { MOVEMENTS } from './index';
import { normalizeText } from '../lib/normalize';
import type { Lang } from '../i18n/lang';
import { UI, GENRE_I18N } from '../i18n/ui';

function join(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

const FR_BY_ID = new Map(MOVEMENTS.map((m) => [m.id, m]));

export function buildNodes(movements: Movement[], lang: Lang = 'fr'): AtlasNode[] {
  const nodes: AtlasNode[] = [];
  for (const m of movements) {
    // en mode EN, le texte de recherche inclut aussi les libellés FR d'origine
    const raw = lang === 'fr' ? m : (FR_BY_ID.get(m.id) ?? m);
    nodes.push({
      kind: 'mouvement',
      id: m.id,
      label: m.name,
      sublabel: m.tagline,
      movementId: m.id,
      searchText: normalizeText(
        join(m.name, raw.name, m.altNames?.join(' '), m.tagline, raw.tagline, m.summary, raw.summary),
      ),
    });
    const rawTendances = new Map(raw.tendances.map((t) => [t.id, t]));
    for (const t of m.tendances) {
      const rt = rawTendances.get(t.id);
      nodes.push({
        kind: 'tendance',
        id: t.id,
        label: t.name,
        sublabel: m.name,
        movementId: m.id,
        tendanceId: t.id,
        searchText: normalizeText(join(t.name, rt?.name, m.name, raw.name, t.summary, rt?.summary, t.traits.join(' '), rt?.traits.join(' '))),
      });
    }
    const rawAuteurs = new Map(raw.auteurs.map((a) => [a.id, a]));
    for (const a of m.auteurs) {
      const ra = rawAuteurs.get(a.id);
      nodes.push({
        kind: 'auteur',
        id: a.id,
        label: a.name,
        sublabel: a.qualite,
        movementId: m.id,
        tendanceId: a.tendanceId,
        auteurId: a.id,
        searchText: normalizeText(join(a.name, a.qualite, ra?.qualite, m.name, raw.name, a.bio, ra?.bio)),
      });
    }
    const rawOeuvres = new Map(raw.oeuvres.map((o) => [o.id, o]));
    for (const o of m.oeuvres) {
      const ro = rawOeuvres.get(o.id);
      nodes.push({
        kind: 'oeuvre',
        id: o.id,
        label: o.title,
        sublabel: `${o.auteurName}${o.year ? ` · ${o.year}` : ''}`,
        movementId: m.id,
        tendanceId: o.tendanceId,
        auteurId: o.auteurId,
        searchText: normalizeText(join(o.title, o.auteurName, m.name, raw.name, o.genre, UI[lang][GENRE_I18N[o.genre]], o.comment, ro?.comment)),
      });
    }
  }
  return nodes;
}

export const ATLAS_NODES: AtlasNode[] = buildNodes(MOVEMENTS);
