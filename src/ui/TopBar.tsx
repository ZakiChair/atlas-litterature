import { SearchBox } from './SearchBox';
import { useStore } from '../state/store';
import { LangSwitcher } from '../i18n/LangSwitcher';
import { useLang } from '../i18n/lang';
import { Filter, Info, Map } from 'lucide-react';

export function TopBar({ onMethod }: { onMethod: () => void }) {
  const { state, dispatch } = useStore();
  const { t } = useLang();
  const activeFilters =
    state.filters.domaines.length +
    Object.values(state.filters.linkKinds).filter((v) => !v).length +
    (state.filters.period[0] !== 452 || state.filters.period[1] !== 2025 ? 1 : 0);

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <Map size={18} className="brand-icon" />
        <div>
          <h1>{t('app.title')}</h1>
          <p className="topbar-sub">{t('app.subtitle')}</p>
        </div>
      </div>
      <div className="topbar-search">
        <SearchBox />
      </div>
      <div className="topbar-actions">
        <LangSwitcher />
        <button
          className={`icon-btn${state.ui.filtersOpen ? ' on' : ''}`}
          onClick={() => dispatch({ type: 'toggle-ui', key: 'filtersOpen' })}
          title={t('nav.filters')}
          aria-label={t('nav.filters')}
        >
          <Filter size={17} />
          {activeFilters > 0 && <span className="badge">{activeFilters}</span>}
        </button>
        <button
          className={`icon-btn${state.ui.legendOpen ? ' on' : ''}`}
          onClick={() => dispatch({ type: 'toggle-ui', key: 'legendOpen' })}
          title={t('nav.legend')}
          aria-label={t('nav.legend')}
        >
          <Info size={17} />
        </button>
        <button className="icon-btn" onClick={onMethod} title={t('nav.method')} aria-label={t('nav.method')}>
          <span className="method-mark">?</span>
        </button>
      </div>
    </header>
  );
}
