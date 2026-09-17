import type { Movement } from '../types';

export const LUMIERES: Movement[] = [
  {
    id: 'lumieres',
    name: 'Lumières',
    altNames: ['Philosophie des Lumières'],
    era: 'lumieres',
    period: { start: 1715, end: 1789 },
    domaines: ['essai', 'roman', 'theatre'],
    map: { x: 3480, y: 2540, size: 3, palette: { fill: '#f5ead0', stroke: '#cfae5e', accent: '#8f6f1f' } },
    tagline: 'Écrasez l’infâme : la raison critique tout — rois, prêtres, préjugés — et le roman devient laboratoire.',
    summary:
      'Le siècle de la philosophie critique : l’Encyclopédie cartographie le savoir, Voltaire fait du conte une arme contre le fanatisme, Rousseau théorise le contrat social et le moi autobiographique, Diderot invente avec Jacques le fataliste un roman labyrinthique. Le conte philosophique, la correspondance et le théâtre bourgeois changent l’écriture en acte politique.',
    keyDates: [
      { year: 1721, text: 'Lettres persanes de Montesquieu : l’Orient comme miroir critique.' },
      { year: 1748, text: 'De l’Esprit des lois de Montesquieu.' },
      { year: 1751, text: 'Premier volume de l’Encyclopédie de Diderot et d’Alembert.' },
      { year: 1759, text: 'Candide de Voltaire : « Il faut cultiver notre jardin ».' },
      { year: 1762, text: 'Du contrat social et Émile de Rousseau, condamnés et brûlés.' },
      { year: 1784, text: 'Le Mariage de Figaro de Beaumarchais, enfin joué.' },
    ],
    tendances: [
      {
        id: 'lu-conte',
        name: 'Conte philosophique',
        summary: 'Candide, Micromégas, l’Ingénu : le récit court comme laboratoire d’idées — ironie, utopie, critique du fanatisme.',
        traits: ['ironie', 'utopie', 'critique religieuse'],
      },
      {
        id: 'lu-encyclopedie',
        name: 'Encyclopédie et critique',
        summary: 'Diderot et d’Alembert compilent les savoirs : le livre devient instrument de combat politique et d’émancipation.',
        traits: ['compilation', 'savoir politique', 'raison critique'],
      },
      {
        id: 'lu-moi',
        name: 'Le moi et la sensibilité',
        summary: 'Rousseau, la Nouvelle Héloïse, les Confessions : l’autobiographie se fait théorie du sujet — sentiment de la nature, vertu de la transparence.',
        traits: ['autobiographie', 'nature', 'contrat social'],
      },
      {
        id: 'lu-roman',
        name: 'Roman expérimental',
        summary: 'Jacques le fataliste, Manon Lescaut, les Liaisons dangereuses : le roman réfléchit sur sa propre fabrique et sur le désir.',
        traits: ['métalepse', 'libertinage', 'dialogisme'],
      },
    ],
    auteurs: [
      { id: 'voltaire', name: 'Voltaire', years: [1694, 1778], qualite: 'philosophe et écrivain', bio: 'Le maître de Ferney : contes, pamphlets, histoire — « Écrasez l’infâme » — le style comme arme contre le fanatisme.', tendanceId: 'lu-conte' },
      { id: 'rousseau', name: 'Jean-Jacques Rousseau', years: [1712, 1778], qualite: 'philosophe et écrivain', bio: 'Le citoyen de Genève : Contrat social, Émile, Confessions — le moi se fait loi, la nature se fait critique.', tendanceId: 'lu-moi' },
      { id: 'diderot', name: 'Denis Diderot', years: [1713, 1784], qualite: 'philosophe et romancier', bio: 'L’âme de l’Encyclopédie : Jacques le fataliste, le Neveu de Rameau — le roman comme pensée en mouvement.', tendanceId: 'lu-roman' },
      { id: 'montesquieu', name: 'Montesquieu', years: [1689, 1755], qualite: 'philosophe', bio: 'Lettres persanes, Esprit des lois : le regard croisé, la théorie des climats, la séparation des pouvoirs.', tendanceId: 'lu-encyclopedie' },
      { id: 'beaumarchais', name: 'Beaumarchais', years: [1732, 1799], qualite: 'dramaturge', bio: 'Le Barbier de Séville, le Mariage de Figaro : le valet parle plus fort que le maître — la comédie devient sédition.', tendanceId: 'lu-roman' },
      { id: 'laclos', name: 'Pierre Choderlos de Laclos', years: [1741, 1803], qualite: 'romancier', bio: 'Les Liaisons dangereuses : le roman épistolaire porté à la perfection glaciale du libertinage.', tendanceId: 'lu-roman' },
      { id: 'prevost', name: 'Abbé Prévost', years: [1697, 1763], qualite: 'romancier', bio: 'Manon Lescaut : l’amour fatal dans les salons du Régent — le roman sensible avant l’heure.', tendanceId: 'lu-roman' },
    ],
    oeuvres: [
      { id: 'candide', title: 'Candide', year: 1759, auteurName: 'Voltaire', auteurId: 'voltaire', tendanceId: 'lu-conte', genre: 'recit', comment: 'L’optimisme à l’épreuve des tremblements de terre : le conte le plus rapide et le plus cruel du siècle.' },
      { id: 'lettres-persanes', title: 'Lettres persanes', year: 1721, auteurName: 'Montesquieu', auteurId: 'montesquieu', tendanceId: 'lu-conte', genre: 'roman', comment: 'Deux Persans à Paris : le miroir inversé qui fait voir l’absurde du royaume.' },
      { id: 'esprit-lois', title: 'De l’Esprit des lois', year: 1748, auteurName: 'Montesquieu', auteurId: 'montesquieu', tendanceId: 'lu-encyclopedie', genre: 'essai', comment: 'La théorie des pouvoirs et des climats : le livre qui écrit la politique moderne.' },
      { id: 'encyclopedie', title: 'Encyclopédie', year: 1751, auteurName: 'Diderot et d’Alembert', auteurId: 'diderot', tendanceId: 'lu-encyclopedie', genre: 'essai', comment: '« Changer la façon commune de penser » : vingt-huit volumes de savoir comme acte de guerre.' },
      { id: 'contrat-social', title: 'Du contrat social', year: 1762, auteurName: 'Jean-Jacques Rousseau', auteurId: 'rousseau', tendanceId: 'lu-moi', genre: 'essai', comment: '« L’homme est né libre, et partout il est dans les fers » : le livre qui fonde la démocratie moderne.' },
      { id: 'confessions', title: 'Les Confessions', year: 1782, auteurName: 'Jean-Jacques Rousseau', auteurId: 'rousseau', tendanceId: 'lu-moi', genre: 'essai', comment: 'L’autobiographie comme expérience de vérité : le moi, ses hontes, ses fautes, son unicité.' },
      { id: 'jacques-fataliste', title: 'Jacques le fataliste', year: 1796, auteurName: 'Denis Diderot', auteurId: 'diderot', tendanceId: 'lu-roman', genre: 'roman', comment: 'Le maître et le valet causent en chemin : le roman qui démonte le roman, en rions.' },
      { id: 'neveu-rameau', title: 'Le Neveu de Rameau', year: 1805, auteurName: 'Denis Diderot', auteurId: 'diderot', tendanceId: 'lu-roman', genre: 'roman', comment: 'Le dialogue avec le parasite : Hegel l’appellera le chef-d’œuvre de la conscience malheureuse.' },
      { id: 'liaisons', title: 'Les Liaisons dangereuses', year: 1782, auteurName: 'Choderlos de Laclos', auteurId: 'laclos', tendanceId: 'lu-roman', genre: 'roman', comment: 'Lettres, manipulation, vertu détruite : le roman épistolaire comme machine de guerre.' },
      { id: 'figaro', title: 'Le Mariage de Figaro', year: 1784, auteurName: 'Beaumarchais', auteurId: 'beaumarchais', tendanceId: 'lu-roman', genre: 'theatre', comment: '« Sans la liberté de blâmer, il n’est point d’éloge flatteur » : la comédie pré-révolutionnaire.' },
      { id: 'manon-lescaut', title: 'Manon Lescaut', year: 1731, auteurName: 'Abbé Prévost', auteurId: 'prevost', tendanceId: 'lu-roman', genre: 'roman', comment: 'L’amour qui ruine : le premier grand roman de la passion fatale.' },
    ],
  },
];
