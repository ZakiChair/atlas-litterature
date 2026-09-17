/**
 * Chaînes d'interface. `fr` est la référence : toute clé manquante en `en`
 * retombe sur le français.
 */
import type { GenreId } from '../data/types';

const fr = {
  'app.title': 'Atlas de la littérature française',
  'app.description': 'Cartographie interactive des mouvements, tendances, auteurs et œuvres de la littérature française.',
  'app.subtitle': 'De la chute de Rome (452) à nos jours',

  'lang.switch': 'Langue / Language',

  'nav.filters': 'Filtres',
  'nav.legend': 'Légende',
  'nav.method': 'Méthode',

  'search.placeholder': 'Mouvement, auteur, œuvre… (ex. Rimbaud)',
  'search.aria': 'Rechercher',
  'search.empty': 'Aucun résultat pour « {q} »',
  'search.kind.mouvement': 'Mouvements',
  'search.kind.tendance': 'Tendances',
  'search.kind.auteur': 'Auteurs',
  'search.kind.oeuvre': 'Œuvres',

  'filters.title': 'Filtres',
  'filters.close': 'Fermer',
  'filters.period': 'Période',
  'filters.from': 'De',
  'filters.to': 'À',
  'filters.domaines': 'Domaines',
  'filters.domainesHint': 'Aucun domaine coché = tous affichés.',
  'filters.linkTypes': 'Types de liens',
  'filters.reset': 'Réinitialiser',

  'legend.title': 'Légende',
  'legend.close': 'Fermer',
  'legend.hint': 'La carte s’organise en quatre voies (poésie, roman, théâtre, essai) traversées par le temps.',
  'legend.domaines': 'Domaines',
  'legend.links': 'Liens',
  'legend.nodes': 'Nœuds',
  'legend.node.movement': 'Mouvement (territoire)',
  'legend.node.tendance': 'Tendance (sous-territoire)',
  'legend.node.auteur': 'Auteur / autrice',
  'legend.node.oeuvre': 'Œuvre',
  'legend.zoomHint': 'Zoomez : les territoires révèlent tendances, auteurs puis œuvres.',

  'link.filiation': 'Filiation',
  'link.influence': 'Influence',
  'link.affinite': 'Affinité',
  'link.reaction': 'Rupture',

  'level.0': 'Mouvements',
  'level.1': 'Tendances',
  'level.2': 'Auteurs',
  'level.3': 'Œuvres',
  'level.aria': 'Niveau de zoom',

  'method.title': 'Méthode',
  'method.close': 'Fermer',
  'method.body':
    'Cet atlas organise les mouvements littéraires français de 452 (chute de Rome, bornage demandé) à nos jours sur un plan symbolique : l’axe horizontal suit les grandes ères, l’axe vertical quatre voies de domaines (poésie, roman, théâtre, essai).\n\nChaque territoire contient des tendances (sous-courants), des auteurs représentatifs et des œuvres commentées. Les liens typés indiquent filiation, influence, affinité ou rupture — ils sont des conventions de lecture, pas des verdicts.\n\nLes notices sont rédigées pour l’exploration : elles privilégient la représentativité et la clarté sur l’exhaustivité académique.',

  'intro.range': '452 – aujourd’hui',
  'intro.body':
    'Une carte navigable des mouvements et tendances littéraires : chaque courant est un territoire. Zoomez pour révéler tendances, auteurs et œuvres ; cliquez pour ouvrir les notices.',
  'intro.key.wheel': 'Molette',
  'intro.key.wheel.do': 'zoomer sur le curseur',
  'intro.key.drag': 'Glisser',
  'intro.key.drag.do': 'se déplacer',
  'intro.key.click': 'Clic',
  'intro.key.click.do': 'ouvrir un mouvement, une tendance, un auteur, une œuvre',
  'intro.cta': 'Explorer la carte',

  'panel.close': 'Fermer',
  'panel.brief': 'En bref',
  'panel.keyDates': 'Repères',
  'panel.tendances': 'Tendances',
  'panel.tendance': 'Tendance',
  'panel.authors': 'Auteurs et autrices',
  'panel.authorsShort': 'Auteurs',
  'panel.works': 'Œuvres représentatives',
  'panel.worksShort': 'Œuvres',
  'panel.links': 'Liens',
  'panel.alsoIn': 'Aussi présent dans',
  'panel.otherWorks': 'Autres œuvres du courant',
  'panel.anonymous': 'anonyme',
  'panel.approxBounds': '(bornes approximatives)',
  'panel.noDate': 'n.d.',
  'panel.kind.tendance': 'Tendance',
  'panel.kind.auteur': 'Auteur',
  'panel.kind.oeuvre': 'Œuvre',

  'popover.aria': 'Détail du lien',

  'breadcrumb.aria': 'Fil d’Ariane',

  'zoom.controls': 'Contrôles de zoom',
  'zoom.in': 'Zoomer',
  'zoom.out': 'Dézoomer',
  'zoom.reset': 'Recentrer',

  'map.aria': 'Carte des mouvements littéraires',

  'period.today': 'aujourd’hui',
  'period.ca': 'ca. ',

  'genre.roman': 'roman',
  'genre.poesie': 'poésie',
  'genre.theatre': 'théâtre',
  'genre.essai': 'essai',
  'genre.recit': 'récit',
} as const;

export type UiKey = keyof typeof fr;

const en: Record<UiKey, string> = {
  'app.title': 'Atlas of French Literature',
  'app.description': 'An interactive cartography of movements, trends, authors and works of French literature.',
  'app.subtitle': 'From the fall of Rome (452) to the present day',

  'lang.switch': 'Langue / Language',

  'nav.filters': 'Filters',
  'nav.legend': 'Legend',
  'nav.method': 'Method',

  'search.placeholder': 'Movement, author, work… (e.g. Rimbaud)',
  'search.aria': 'Search',
  'search.empty': 'No results for “{q}”',
  'search.kind.mouvement': 'Movements',
  'search.kind.tendance': 'Trends',
  'search.kind.auteur': 'Authors',
  'search.kind.oeuvre': 'Works',

  'filters.title': 'Filters',
  'filters.close': 'Close',
  'filters.period': 'Period',
  'filters.from': 'From',
  'filters.to': 'To',
  'filters.domaines': 'Fields',
  'filters.domainesHint': 'No field checked = all shown.',
  'filters.linkTypes': 'Link types',
  'filters.reset': 'Reset',

  'legend.title': 'Legend',
  'legend.close': 'Close',
  'legend.hint': 'The map is organised in four lanes (poetry, novel, theatre, essay) crossed by time.',
  'legend.domaines': 'Fields',
  'legend.links': 'Links',
  'legend.nodes': 'Nodes',
  'legend.node.movement': 'Movement (territory)',
  'legend.node.tendance': 'Trend (sub-territory)',
  'legend.node.auteur': 'Author',
  'legend.node.oeuvre': 'Work',
  'legend.zoomHint': 'Zoom in: territories reveal trends, authors, then works.',

  'link.filiation': 'Lineage',
  'link.influence': 'Influence',
  'link.affinite': 'Affinity',
  'link.reaction': 'Rupture',

  'level.0': 'Movements',
  'level.1': 'Trends',
  'level.2': 'Authors',
  'level.3': 'Works',
  'level.aria': 'Zoom level',

  'method.title': 'Method',
  'method.close': 'Close',
  'method.body':
    'This atlas organises French literary movements from 452 (the fall of Rome, the requested starting point) to the present day on a symbolic plane: the horizontal axis follows the great eras, the vertical axis four field lanes (poetry, novel, theatre, essay).\n\nEach territory contains trends (sub-currents), representative authors and commented works. Typed links indicate lineage, influence, affinity or rupture — they are reading conventions, not verdicts.\n\nThe notices are written for exploration: they favour representativeness and clarity over academic exhaustiveness.',

  'intro.range': '452 – today',
  'intro.body':
    'A navigable map of literary movements and trends: each current is a territory. Zoom in to reveal trends, authors and works; click to open the notices.',
  'intro.key.wheel': 'Wheel',
  'intro.key.wheel.do': 'zoom at the cursor',
  'intro.key.drag': 'Drag',
  'intro.key.drag.do': 'move around',
  'intro.key.click': 'Click',
  'intro.key.click.do': 'open a movement, a trend, an author, a work',
  'intro.cta': 'Explore the map',

  'panel.close': 'Close',
  'panel.brief': 'In brief',
  'panel.keyDates': 'Key dates',
  'panel.tendances': 'Trends',
  'panel.tendance': 'Trend',
  'panel.authors': 'Authors',
  'panel.authorsShort': 'Authors',
  'panel.works': 'Representative works',
  'panel.worksShort': 'Works',
  'panel.links': 'Links',
  'panel.alsoIn': 'Also present in',
  'panel.otherWorks': 'Other works of the movement',
  'panel.anonymous': 'anonymous',
  'panel.approxBounds': '(approximate bounds)',
  'panel.noDate': 'n.d.',
  'panel.kind.tendance': 'Trend',
  'panel.kind.auteur': 'Author',
  'panel.kind.oeuvre': 'Work',

  'popover.aria': 'Link detail',

  'breadcrumb.aria': 'Breadcrumb',

  'zoom.controls': 'Zoom controls',
  'zoom.in': 'Zoom in',
  'zoom.out': 'Zoom out',
  'zoom.reset': 'Reset view',

  'map.aria': 'Map of literary movements',

  'period.today': 'today',
  'period.ca': 'ca. ',

  'genre.roman': 'novel',
  'genre.poesie': 'poetry',
  'genre.theatre': 'theatre',
  'genre.essai': 'essay',
  'genre.recit': 'narrative',
};

export const UI: Record<'fr' | 'en', Record<UiKey, string>> = { fr, en };

export const GENRE_I18N: Record<GenreId, UiKey> = {
  roman: 'genre.roman',
  poesie: 'genre.poesie',
  theatre: 'genre.theatre',
  essai: 'genre.essai',
  recit: 'genre.recit',
};
