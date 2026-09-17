import type { Movement } from './types';
import { MOYEN_AGE } from './movements/moyen-age';
import { RENAISSANCE } from './movements/renaissance';
import { GRAND_SIECLE } from './movements/grand-siecle';
import { LUMIERES } from './movements/lumieres';
import { DIXNEUVIEME } from './movements/dixneuvieme';
import { CONTEMPORAIN } from './movements/contemporain';

export const MOVEMENTS: Movement[] = [
  ...MOYEN_AGE,
  ...RENAISSANCE,
  ...GRAND_SIECLE,
  ...LUMIERES,
  ...DIXNEUVIEME,
  ...CONTEMPORAIN,
];

const byId = new Map(MOVEMENTS.map((m) => [m.id, m]));

export function getMovement(id: string): Movement | undefined {
  return byId.get(id);
}

export function getTendance(movement: Movement, tendanceId: string) {
  return movement.tendances.find((t) => t.id === tendanceId);
}

export function getAuteur(movement: Movement, auteurId: string) {
  return movement.auteurs.find((a) => a.id === auteurId);
}

export function getOeuvre(movement: Movement, oeuvreId: string) {
  return movement.oeuvres.find((o) => o.id === oeuvreId);
}

/** Liste les mouvements (id) dans lesquels apparaît un auteur (pour le panneau). */
export function movementsOfAuteur(auteurId: string): Movement[] {
  return MOVEMENTS.filter((m) => m.auteurs.some((a) => a.id === auteurId));
}
