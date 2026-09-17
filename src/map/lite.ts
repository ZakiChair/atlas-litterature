/**
 * Mode allégé : mobiles/tablettes (pointeur tactile) et fenêtres étroites.
 * Désactive les filtres SVG coûteux (feTurbulence, flous gaussiens) qui sont
 * re-rasterisés à chaque frame de déplacement/zoom sur les GPU mobiles.
 */
export const LITE =
  typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(max-width: 1023px)').matches);
