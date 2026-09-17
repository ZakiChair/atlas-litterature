import type { AtlasNode, NodeKind } from '../data/types';
import { ATLAS_NODES } from '../data/nodes';
import { normalizeText } from './normalize';
import type { UiKey } from '../i18n/ui';

export interface SearchResult {
  node: AtlasNode;
  score: number;
}

const KIND_ORDER: NodeKind[] = ['mouvement', 'tendance', 'auteur', 'oeuvre'];
const PER_GROUP = 6;

function score(node: AtlasNode, query: string): number {
  const text = node.searchText;
  if (text === query) return 100;
  if (text.startsWith(query)) return 90;
  const words = text.split(' ');
  if (words.some((w) => w.startsWith(query))) return 70;
  const qWords = query.split(' ').filter(Boolean);
  if (text.includes(query)) return qWords.length > 1 ? 65 : 40;
  if (qWords.length > 1 && qWords.every((qw) => words.some((w) => w.startsWith(qw)))) return 60;
  return 0;
}

export function search(query: string, nodes: AtlasNode[] = ATLAS_NODES): SearchResult[] {
  const q = normalizeText(query);
  if (!q) return [];
  const scored: SearchResult[] = [];
  for (const node of nodes) {
    const s = score(node, q);
    if (s > 0) scored.push({ node, score: s });
  }
  scored.sort((a, b) => b.score - a.score || a.node.label.localeCompare(b.node.label, 'fr'));
  const groups = new Map<NodeKind, SearchResult[]>();
  for (const r of scored) {
    const g = groups.get(r.node.kind) ?? [];
    if (g.length < PER_GROUP) g.push(r);
    groups.set(r.node.kind, g);
  }
  return KIND_ORDER.flatMap((k) => groups.get(k) ?? []);
}

export const KIND_I18N: Record<NodeKind, UiKey> = {
  mouvement: 'search.kind.mouvement',
  tendance: 'search.kind.tendance',
  auteur: 'search.kind.auteur',
  oeuvre: 'search.kind.oeuvre',
};

export { KIND_ORDER, PER_GROUP };
