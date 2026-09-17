export interface Bounds {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface ViewportInset {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

export interface MapController {
  /**
   * Zoome pour que bounds occupe ≈ fill de la plus petite dimension visible (hors inset).
   * `maxK` plafonne le zoom absolu (px par unité carte), p. ex. pour rester au niveau « Tendances ».
   */
  zoomToBounds: (bounds: Bounds, fill?: number, duration?: number, inset?: ViewportInset, maxK?: number) => void;
  /** Zoome vers un niveau sémantique (0-3) en conservant le centre. */
  zoomToLevel: (level: number, duration?: number) => void;
  /** Retour à la vue d'ensemble. */
  reset: (duration?: number) => void;
  getLevel: () => number;
}
