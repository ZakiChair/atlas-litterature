import type { Link } from './types';

/**
 * Liens entre mouvements. kind :
 *  - filiation : continuité directe (mêmes milieux, revues, auteurs)
 *  - influence : filiation à distance, relecture, redécouverte
 *  - affinite  : parenté esthétique sans causalité démontrée
 *  - reaction  : rupture ou opposition explicite
 */
export const LINKS: Link[] = [
  // Moyen Âge
  { source: 'haut-moyen-age', target: 'chansons-de-geste', kind: 'filiation', label: 'Du latin à l’épopée', note: 'Les vies de saints versifiées et les récits carolingiens préparent le vers épique des chansons de geste.' },
  { source: 'chansons-de-geste', target: 'roman-courtois', kind: 'reaction', label: 'De la bataille à l’amour', note: 'Le roman courtois supplante l’épopée : l’errance individuelle et la fin’amor remplacent la prouesse collective.' },
  { source: 'roman-courtois', target: 'poesie-lyrique-med', kind: 'filiation', label: 'La lyrique courtoise', note: 'La fin’amor du roman passe dans les formes fixes : ballades et rondeaux de cour.' },
  { source: 'roman-courtois', target: 'theatre-medieval', kind: 'influence', label: 'Le merveilleux sur scène', note: 'Miracles et mystères reprennent les figures du merveilleux médiéval pour les places publiques.' },
  { source: 'poesie-lyrique-med', target: 'pleiade', kind: 'influence', label: 'De la ballade au sonnet', note: 'Les formes fixes des rhétoriqueurs préparent la virtuosité du sonnet pléiadien.' },
  { source: 'theatre-medieval', target: 'classicisme', kind: 'reaction', label: 'Contre le mystère', note: 'La farce et le mystère populaires sont réprouvés par la scène régulière : Molière garde l’héritage du rire, Racine le nie.' },

  // Renaissance
  { source: 'humanisme', target: 'pleiade', kind: 'filiation', label: 'La langue illustrée', note: 'Le programme humaniste d’enrichir le français devient le manifeste poétique de la Défense et illustration.' },
  { source: 'humanisme', target: 'moralistes', kind: 'influence', label: 'L’essai hérité', note: 'Montaigne invente la forme ; les moralistes du Grand Siècle condensent la pensée en maximes.' },
  { source: 'pleiade', target: 'baroque', kind: 'reaction', label: 'Après la perfection', note: 'Contre la mesure pléiadienne, le baroque cultive l’ornement, le paradoxe et le vertige.' },
  { source: 'baroque', target: 'classicisme', kind: 'reaction', label: 'La règle contre le vertige', note: 'L’ordre classique borne l’exubérance baroque : Le Cid triomphe, la querelle impose les unités.' },
  { source: 'baroque', target: 'realisme', kind: 'affinite', label: 'La comédie humaine avant l’heure', note: 'Le Roman comique de Scarron annonce la satire réaliste : le monde des comédiens contre le roman de longue haleine.' },

  // Grand Siècle → Lumières
  { source: 'classicisme', target: 'lumieres', kind: 'filiation', label: 'La raison héritée', note: 'La rigueur classique passe dans la prose critique des Lumières : le goût devient arme.' },
  { source: 'moralistes', target: 'lumieres', kind: 'filiation', label: 'De la maxime au pamphlet', note: 'La Bruyère et La Rochefoucauld forment le style de la critique sociale que Voltaire radicalise.' },
  { source: 'lumieres', target: 'romantisme', kind: 'influence', label: 'Rousseau, père du moi', note: 'Les Confessions et la Nouvelle Héloïse fondent le lyrisme du moi que les romantiques héritent.' },

  // XIXe
  { source: 'romantisme', target: 'realisme', kind: 'reaction', label: 'Contre l’idéal', note: 'Balzac et Flaubert décrivent la société contre le lyrisme : le vrai remplace le beau.' },
  { source: 'romantisme', target: 'parnasse', kind: 'reaction', label: 'L’impassibilité contre le moi', note: 'Les parnassiens rejettent l’épanchement romantique : le vers sculpté, l’art pour l’art.' },
  { source: 'realisme', target: 'naturalisme', kind: 'filiation', label: 'Du réel au document', note: 'Zola radicalise la méthode de Flaubert et des Goncourt en « roman expérimental ».' },
  { source: 'parnasse', target: 'symbolisme', kind: 'reaction', label: 'La suggestion contre le marbre', note: 'Les symbolistes reprennent le travail formel parnassien pour le retourner vers la musique et le mystère.' },
  { source: 'naturalisme', target: 'symbolisme', kind: 'reaction', label: 'À rebours', note: 'Huysmans quitte le naturalisme pour la névrose décadente : le manifeste est dans le roman même.' },
  { source: 'symbolisme', target: 'roman-analyse', kind: 'influence', label: 'L’intériorité', note: 'La suggestion symboliste et le monologue intérieur préparent la Recherche et le roman de la NRF.' },
  { source: 'realisme', target: 'roman-analyse', kind: 'influence', label: 'De la société à la conscience', note: 'Le roman d’observation se retourne vers l’intérieur : Flaubert annonce Proust.' },

  // XXe
  { source: 'symbolisme', target: 'dada', kind: 'reaction', label: 'Détruire le vers', note: 'Dada pousse la libération du vers jusqu’au hasard et au néant : la poésie devient anti-art.' },
  { source: 'dada', target: 'surrealisme', kind: 'filiation', label: 'Des cendres de Dada', note: 'Breton, Aragon, Soupault passent de la destruction dadaïste à l’automatisme surréaliste.' },
  { source: 'surrealisme', target: 'poesie-contemporaine', kind: 'filiation', label: 'Après l’automatisme', note: 'Char, Bonnefoy, Du Bouchet héritent du surréalisme qu’ils dépassent : la présence remplace le rêve.' },
  { source: 'roman-analyse', target: 'existentialisme', kind: 'influence', label: 'Le roman en situation', note: 'L’introspection de la NRF devient philosophie vécue : Sartre et Beauvoir héritent de Gide.' },
  { source: 'existentialisme', target: 'theatre-absurde', kind: 'affinite', label: 'L’absurde en scène', note: 'La liberté sartrienne et l’absurde camusien trouvent leur forme scénique chez Beckett et Ionesco.' },
  { source: 'existentialisme', target: 'nouveau-roman', kind: 'reaction', label: 'Contre l’engagement', note: 'Les nouveaux romanciers refusent le roman à thèse : les choses d’abord, l’idéologie ensuite.' },
  { source: 'roman-analyse', target: 'nouveau-roman', kind: 'reaction', label: 'La mort du personnage', note: 'Robbe-Grillet et Sarraute détruisent le héros psychologique que la NRF avait porté au sommet.' },
  { source: 'nouveau-roman', target: 'oulipo', kind: 'affinite', label: 'La forme comme jeu', note: 'Mêmes années, même maison (Minuit pour certains) : la contrainte oulipienne et le roman expérimental se croisent.' },
  { source: 'roman-analyse', target: 'autofiction', kind: 'filiation', label: 'Le moi romancé', note: 'De Proust à Doubrovsky : la mémoire du moi devient le matériau déclaré de la fiction.' },
  { source: 'nouveau-roman', target: 'litterature-contemporaine', kind: 'reaction', label: 'Le retour du récit', note: 'Echenoz, Toussaint, Carrère renouent avec le récit sans restaurer le roman d’avant.' },
  { source: 'autofiction', target: 'litterature-contemporaine', kind: 'filiation', label: 'Le moi documentaire', note: 'L’autofiction nourrit le récit-enquête contemporain : Carrère hérite d’Ernaux.' },
  { source: 'litterature-monde', target: 'litterature-contemporaine', kind: 'affinite', label: 'La langue partagée', note: 'La francophonie décentre le roman français : NDiaye et Diop écrivent le même espace littéraire.' },
  { source: 'surrealisme', target: 'oulipo', kind: 'affinite', label: 'Le hasard discipliné', note: 'L’automatisme surréaliste se systématise en contraintes oulipiennes : le jeu devient méthode.' },
];
