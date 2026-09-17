import { useStore, type Filters } from '../state/store';
import { TIME_BOUNDS } from '../data/eras';
import { MOVEMENTS } from '../data';
import { X } from 'lucide-react';
import type { LinkKind } from '../data/types';
import { useLang } from '../i18n/lang';
import { useData, LINK_KIND_I18N } from '../i18n/localize';

/** Ids des mouvements estompés par les filtres (période + domaines). */
// oxlint-disable-next-line react/only-export-components
export function computeDimmed(filters: Filters): Set<string> {
  const [lo, hi] = filters.period;
  const set = new Set<string>();
  for (const m of MOVEMENTS) {
    const inPeriod = (m.period.end ?? TIME_BOUNDS.end) >= lo && m.period.start <= hi;
    const domaineOk = filters.domaines.length === 0 || m.domaines.some((d) => filters.domaines.includes(d));
    if (!inPeriod || !domaineOk) set.add(m.id);
  }
  return set;
}

const KINDS: LinkKind[] = ['filiation', 'influence', 'affinite', 'reaction'];

export function FiltersDrawer() {
  const { state, dispatch } = useStore();
  const { t } = useLang();
  const { domaines } = useData();
  if (!state.ui.filtersOpen) return null;
  const [lo, hi] = state.filters.period;

  return (
    <aside className="filters panel-card">
      <button className="close-btn" onClick={() => dispatch({ type: 'toggle-ui', key: 'filtersOpen' })} aria-label={t('filters.close')}>
        <X size={14} />
      </button>
      <h3>{t('filters.title')}</h3>

      <h4>{t('filters.period')}</h4>
      <div className="period-row">
        <label>
          {t('filters.from')}
          <input
            type="number"
            min={TIME_BOUNDS.start}
            max={hi}
            value={lo}
            onChange={(e) => dispatch({ type: 'set-period', period: [Math.min(Number(e.target.value) || TIME_BOUNDS.start, hi), hi] })}
          />
        </label>
        <label>
          {t('filters.to')}
          <input
            type="number"
            min={lo}
            max={TIME_BOUNDS.end}
            value={hi}
            onChange={(e) => dispatch({ type: 'set-period', period: [lo, Math.max(Number(e.target.value) || TIME_BOUNDS.end, lo)] })}
          />
        </label>
      </div>

      <h4>{t('filters.domaines')}</h4>
      <div className="chip-row">
        {domaines.map((d) => (
          <button
            key={d.id}
            className={`chip toggle${state.filters.domaines.includes(d.id) ? ' on' : ''}`}
            onClick={() => dispatch({ type: 'toggle-domaine', domaine: d.id })}
          >
            {d.name}
          </button>
        ))}
      </div>
      <p className="hint">{t('filters.domainesHint')}</p>

      <h4>{t('filters.linkTypes')}</h4>
      <div className="chip-row">
        {KINDS.map((k) => (
          <button
            key={k}
            className={`chip toggle${state.filters.linkKinds[k] ? ' on' : ''}`}
            onClick={() => dispatch({ type: 'toggle-link-kind', kind: k })}
          >
            {t(LINK_KIND_I18N[k])}
          </button>
        ))}
      </div>

      <button className="reset-btn" onClick={() => dispatch({ type: 'reset-filters' })}>{t('filters.reset')}</button>
    </aside>
  );
}
