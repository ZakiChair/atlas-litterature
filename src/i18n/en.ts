/**
 * Traductions anglaises du corpus. Généré par `npm run i18n` (scripts/i18n-generate.ts) :
 * traduction MiniMax des textes FR. Toute clé absente retombe sur le français à l'affichage.
 */

export interface EnMovement {
  name?: string;
  altNames?: string[];
  tagline?: string;
  summary?: string;
  keyDates?: string[];
  tendances?: Record<string, { name?: string; summary?: string; traits?: string[] }>;
  auteurs?: Record<string, { bio?: string; qualite?: string }>;
  oeuvres?: Record<string, { comment?: string; auteurName?: string }>;
}

export interface EnData {
  eras: Record<string, { name?: string; tagline?: string }>;
  domaines: Record<string, { name?: string; shortName?: string }>;
  movements: Record<string, EnMovement>;
  /** clé : `${source}|${target}|${kind}` */
  links: Record<string, { label?: string; note?: string }>;
}

export { EN_DATA as EN } from './en-data';
