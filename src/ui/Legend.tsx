import { useStore } from '../state/store';
import { X } from 'lucide-react';
import { useLang } from '../i18n/lang';
import { useData, LINK_KIND_I18N } from '../i18n/localize';
import type { LinkKind } from '../data/types';
import type { UiKey } from '../i18n/ui';

const KIND_STYLE: Record<string, { dash?: string; color: string }> = {
  filiation: { color: '#5b7fb5' },
  influence: { color: '#d4708f', dash: '8 5' },
  affinite: { color: '#9a86cc', dash: '2 5' },
  reaction: { color: '#c9574f' },
};

const KINDS: LinkKind[] = ['filiation', 'influence', 'affinite', 'reaction'];

const DOMAIN_COLOR: Record<string, string> = {
  poesie: '#d4708f',
  roman: '#5b7fb5',
  theatre: '#9a86cc',
  essai: '#6fae93',
};

const NODE_KEYS: { key: UiKey; cls: string }[] = [
  { key: 'legend.node.movement', cls: 'swatch-blob' },
  { key: 'legend.node.tendance', cls: 'swatch-mini' },
  { key: 'legend.node.auteur', cls: 'swatch-dot' },
  { key: 'legend.node.oeuvre', cls: 'swatch-diamond' },
];

export function Legend() {
  const { state, dispatch } = useStore();
  const { t } = useLang();
  const { domaines } = useData();
  if (!state.ui.legendOpen) return null;
  return (
    <aside className="legend panel-card">
      <button className="close-btn" onClick={() => dispatch({ type: 'toggle-ui', key: 'legendOpen' })} aria-label={t('legend.close')}>
        <X size={14} />
      </button>
      <h3>{t('legend.title')}</h3>
      <p className="legend-hint">{t('legend.hint')}</p>
      <h4>{t('legend.domaines')}</h4>
      <ul>
        {domaines.map((d) => (
          <li key={d.id}><span className="dot" style={{ background: DOMAIN_COLOR[d.id] }} /> {d.name}</li>
        ))}
      </ul>
      <h4>{t('legend.links')}</h4>
      <ul>
        {KINDS.map((k) => (
          <li key={k}>
            <svg width="34" height="8" className="link-swatch"><line x1="0" y1="4" x2="34" y2="4" stroke={KIND_STYLE[k].color} strokeWidth="2" strokeDasharray={KIND_STYLE[k].dash} /></svg>
            {t(LINK_KIND_I18N[k])}
          </li>
        ))}
      </ul>
      <h4>{t('legend.nodes')}</h4>
      <ul className="legend-nodes">
        {NODE_KEYS.map((n) => (
          <li key={n.key}><span className={`swatch ${n.cls}`} /> {t(n.key)}</li>
        ))}
      </ul>
      <p className="legend-hint">{t('legend.zoomHint')}</p>
    </aside>
  );
}
