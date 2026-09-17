/**
 * Schéma de données de l'Atlas de la littérature française.
 *
 * Quatre niveaux de lecture sur la carte :
 *  - mouvement : le territoire (un courant ou une tendance majeure) ;
 *  - tendance  : un sous-courant ou genre à l'intérieur du territoire ;
 *  - auteur    : une figure représentative ;
 *  - œuvre     : un texte emblématique, commenté.
 */

export type EraId = 'moyen-age' | 'renaissance' | 'grand-siecle' | 'lumieres' | 'dixneuvieme' | 'contemporain';

export interface Era {
  id: EraId;
  name: string;
  period: Period;
  tagline: string;
}

export type DomaineId = 'poesie' | 'roman' | 'theatre' | 'essai';

export interface Domaine {
  id: DomaineId;
  name: string;
  shortName?: string;
  /** Centre de la bande horizontale indicative (unités carte). */
  laneY: number;
  /** Bornes verticales de la bande (unités carte) ; les bandes sont contiguës. */
  y0: number;
  y1: number;
}

export interface Period {
  start: number;
  /** `null` = toujours actif. */
  end: number | null;
  /** Bornes conventionnelles, discutées par les historiens. */
  approx?: boolean;
}

export type LinkKind = 'filiation' | 'influence' | 'affinite' | 'reaction';

export interface Link {
  /** Identifiant du mouvement d'origine (antérieur ou contemporain). */
  source: string;
  /** Identifiant du mouvement d'arrivée. */
  target: string;
  /**
   * filiation : continuité historique directe (mêmes milieux, revues, maisons)
   * influence : influence esthétique ou idéologique documentée à distance
   * affinite  : parenté esthétique sans causalité démontrée
   * reaction  : rupture ou opposition explicite
   */
  kind: LinkKind;
  /** Formule courte affichée sur la carte / dans le panneau. */
  label: string;
  /** Explication en une ou deux phrases. */
  note: string;
}

export interface Tendance {
  id: string;
  name: string;
  period?: Period;
  summary: string;
  /** Caractéristiques formelles, en quelques mots chacune. */
  traits: string[];
}

export interface Auteur {
  id: string;
  name: string;
  /** [naissance, mort | null si vivant]. null,null = anonyme / collectif. */
  years: [number | null, number | null];
  /** Qualité dominante : poète, romancière, dramaturge, philosophe… */
  qualite: string;
  /** Deux ou trois phrases : rôle dans le mouvement, singularité. */
  bio: string;
  /** Tendance principale, si pertinent. */
  tendanceId?: string;
}

export type GenreId = 'roman' | 'poesie' | 'theatre' | 'essai' | 'recit';

export interface Oeuvre {
  id: string;
  title: string;
  year?: number;
  /** Nom affiché de l'auteur ou « Anonyme ». */
  auteurName: string;
  /** Référence vers `Auteur.id` si la figure est dans l'atlas. */
  auteurId?: string;
  tendanceId?: string;
  genre: GenreId;
  /** Pourquoi ce texte : place dans le mouvement, ce qu'il fait. */
  comment: string;
}

export interface MapPlacement {
  /** Coordonnées cibles en unités carte (voir MAP_SIZE). L'axe x suit les bandes d'ères (ERA_BANDS), l'axe y les domaines (DOMAINES.laneY). */
  x: number;
  y: number;
  /** Importance historique → rayon du territoire. */
  size: 1 | 2 | 3;
  palette: {
    fill: string;
    stroke: string;
    accent: string;
  };
}

export interface KeyDate {
  year: number;
  text: string;
}

export interface Movement {
  id: string;
  name: string;
  altNames?: string[];
  era: EraId;
  period: Period;
  domaines: DomaineId[];
  map: MapPlacement;
  /** Une ligne, ton évocateur. */
  tagline: string;
  /** Description accessible en trois ou quatre phrases. */
  summary: string;
  keyDates: KeyDate[];
  tendances: Tendance[];
  auteurs: Auteur[];
  oeuvres: Oeuvre[];
}

/** Nœud aplati pour la recherche et la navigation. */
export type NodeKind = 'mouvement' | 'tendance' | 'auteur' | 'oeuvre';

export interface AtlasNode {
  kind: NodeKind;
  id: string;
  label: string;
  sublabel?: string;
  movementId: string;
  tendanceId?: string;
  auteurId?: string;
  /** Champs normalisés (sans accents, minuscules) pour la recherche. */
  searchText: string;
}
