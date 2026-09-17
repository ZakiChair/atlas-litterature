import type { Era, EraId, Domaine } from './types';

export const ERAS: Era[] = [
  {
    id: 'moyen-age',
    name: 'Moyen Âge',
    period: { start: 452, end: 1500 },
    tagline: 'De la chute de Rome aux cours des Valois : épopées, amour courtois, premières voix en langue romane.',
  },
  {
    id: 'renaissance',
    name: 'Renaissance',
    period: { start: 1500, end: 1610 },
    tagline: 'L’humain au centre : l’Antiquité retrouvée, l’imprimerie, la langue illustrée.',
  },
  {
    id: 'grand-siecle',
    name: 'Grand Siècle',
    period: { start: 1610, end: 1715 },
    tagline: 'Règles, salons et raison : le théâtre au sommet, la prose au service de l’ordre.',
  },
  {
    id: 'lumieres',
    name: 'Lumières',
    period: { start: 1715, end: 1789 },
    tagline: 'La raison critique : contes philosophiques, encyclopédie, critique sociale.',
  },
  {
    id: 'dixneuvieme',
    name: 'XIXᵉ siècle',
    period: { start: 1789, end: 1914 },
    tagline: 'Le siècle du roman : révolutions, réalisme, poésie moderne.',
  },
  {
    id: 'contemporain',
    name: 'XXᵉ – XXIᵉ siècle',
    period: { start: 1914, end: null },
    tagline: 'Avant-gardes, engagement, expérimentations du récit.',
  },
];

/**
 * Bandes de domaines sur l'axe vertical (unités carte), contiguës.
 */
export const DOMAINES: Domaine[] = [
  { id: 'poesie', name: 'Poésie', laneY: 390, y0: 0, y1: 780 },
  { id: 'roman', name: 'Roman & récit', shortName: 'Roman', laneY: 1170, y0: 780, y1: 1560 },
  { id: 'theatre', name: 'Théâtre', laneY: 1950, y0: 1560, y1: 2340 },
  { id: 'essai', name: 'Essai & pensée', shortName: 'Essai', laneY: 2670, y0: 2340, y1: 3000 },
];

/**
 * Bandes d'ères sur l'axe horizontal (unités carte). La chronologie n'est
 * qu'approximative : l'axe horizontal ordonne les mouvements par période,
 * l'axe vertical par domaine dominant.
 */
export const ERA_BANDS: { era: EraId; x0: number; x1: number }[] = [
  { era: 'moyen-age', x0: 0, x1: 1350 },
  { era: 'renaissance', x0: 1350, x1: 2350 },
  { era: 'grand-siecle', x0: 2350, x1: 3150 },
  { era: 'lumieres', x0: 3150, x1: 3850 },
  { era: 'dixneuvieme', x0: 3850, x1: 5200 },
  { era: 'contemporain', x0: 5200, x1: 6500 },
];

/** Bornes temporelles de l'atlas (filtres chronologiques). */
export const TIME_BOUNDS = { start: 452, end: 2025 } as const;

/** Dimensions de l'espace carte en unités virtuelles. */
export const MAP_SIZE = { width: 6500, height: 3000 } as const;
