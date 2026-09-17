import { useMemo } from 'react';
import { ERAS, DOMAINES } from '../data/eras';
import { MOVEMENTS } from '../data';
import { LINKS } from '../data/links';
import type { AtlasNode, Domaine, Era, Link, LinkKind, Movement } from '../data/types';
import { buildNodes } from '../data/nodes';
import { EN } from './en';
import { useLang, type Lang } from './lang';
import type { UiKey } from './ui';

export const LINK_KIND_I18N: Record<LinkKind, UiKey> = {
  filiation: 'link.filiation',
  influence: 'link.influence',
  affinite: 'link.affinite',
  reaction: 'link.reaction',
};

export const LEVEL_I18N: UiKey[] = ['level.0', 'level.1', 'level.2', 'level.3'];

/** auteurName hors traduction par entrée : formules génériques. */
const AUTEUR_NAME_EN: Record<string, string> = { Anonyme: 'Anonymous', Collectif: 'Collective' };

// ——— localisation ponctuelle (cache : un clone par objet et par langue) ———

const movementCache = new WeakMap<Movement, Partial<Record<Lang, Movement>>>();

export function localizeMovement(m: Movement, lang: Lang): Movement {
  if (lang === 'fr') return m;
  const hit = movementCache.get(m);
  if (hit?.[lang]) return hit[lang]!;
  const e = EN.movements[m.id];
  if (!e) return m;
  const out: Movement = {
    ...m,
    name: e.name ?? m.name,
    altNames: e.altNames ?? m.altNames,
    tagline: e.tagline ?? m.tagline,
    summary: e.summary ?? m.summary,
    keyDates: m.keyDates.map((k, i) => ({ ...k, text: e.keyDates?.[i] ?? k.text })),
    tendances: m.tendances.map((t) => {
      const et = e.tendances?.[t.id];
      return et ? { ...t, name: et.name ?? t.name, summary: et.summary ?? t.summary, traits: et.traits ?? t.traits } : t;
    }),
    auteurs: m.auteurs.map((a) => {
      const ea = e.auteurs?.[a.id];
      return ea ? { ...a, bio: ea.bio ?? a.bio, qualite: ea.qualite ?? a.qualite } : a;
    }),
    oeuvres: m.oeuvres.map((o) => {
      const eo = e.oeuvres?.[o.id];
      const auteurName = eo?.auteurName ?? AUTEUR_NAME_EN[o.auteurName] ?? o.auteurName;
      return eo ? { ...o, comment: eo.comment ?? o.comment, auteurName } : { ...o, auteurName };
    }),
  };
  movementCache.set(m, { ...hit, [lang]: out });
  return out;
}

export function localizeLink(l: Link, lang: Lang): Link {
  if (lang === 'fr') return l;
  const e = EN.links[`${l.source}|${l.target}|${l.kind}`];
  return e ? { ...l, label: e.label ?? l.label, note: e.note ?? l.note } : l;
}

export function localizeEra(e: Era, lang: Lang): Era {
  if (lang === 'fr') return e;
  const t = EN.eras[e.id];
  return t ? { ...e, name: t.name ?? e.name, tagline: t.tagline ?? e.tagline } : e;
}

export function localizeDomaine(d: Domaine, lang: Lang): Domaine {
  if (lang === 'fr') return d;
  const t = EN.domaines[d.id];
  return t ? { ...d, name: t.name ?? d.name, shortName: t.shortName ?? d.shortName } : d;
}

// ——— accès groupé : toutes les données affichables dans une langue ———

export interface AtlasData {
  lang: Lang;
  movements: Movement[];
  movementById: Record<string, Movement>;
  links: Link[];
  eras: Era[];
  domaines: Domaine[];
  nodes: AtlasNode[];
}

const DATA: Partial<Record<Lang, AtlasData>> = {};

export function atlasData(lang: Lang): AtlasData {
  const hit = DATA[lang];
  if (hit) return hit;
  if (lang === 'fr') {
    const data: AtlasData = {
      lang,
      movements: MOVEMENTS,
      movementById: Object.fromEntries(MOVEMENTS.map((m) => [m.id, m])),
      links: LINKS,
      eras: ERAS,
      domaines: DOMAINES,
      nodes: buildNodes(MOVEMENTS, lang),
    };
    DATA[lang] = data;
    return data;
  }
  const movements = MOVEMENTS.map((m) => localizeMovement(m, lang));
  const data: AtlasData = {
    lang,
    movements,
    movementById: Object.fromEntries(movements.map((m) => [m.id, m])),
    links: LINKS.map((l) => localizeLink(l, lang)),
    eras: ERAS.map((e) => localizeEra(e, lang)),
    domaines: DOMAINES.map((d) => localizeDomaine(d, lang)),
    nodes: buildNodes(movements, lang),
  };
  DATA[lang] = data;
  return data;
}

export function useData(): AtlasData {
  const { lang } = useLang();
  return useMemo(() => atlasData(lang), [lang]);
}
