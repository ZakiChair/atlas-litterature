import { useStore } from '../state/store';
import { useLang } from '../i18n/lang';
import { LangSwitcher } from '../i18n/LangSwitcher';

export function IntroOverlay() {
  const { state, dispatch } = useStore();
  const { t } = useLang();
  if (state.ui.introSeen) return null;
  return (
    <div className="intro-overlay" onClick={() => dispatch({ type: 'intro-seen' })}>
      <div className="intro-card">
        <div className="intro-lang" onClick={(e) => e.stopPropagation()}>
          <LangSwitcher />
        </div>
        <p className="eyebrow">{t('intro.range')}</p>
        <h1>{t('app.title')}</h1>
        <p>{t('intro.body')}</p>
        <ul className="intro-keys">
          <li><strong>{t('intro.key.wheel')}</strong> {t('intro.key.wheel.do')}</li>
          <li><strong>{t('intro.key.drag')}</strong> {t('intro.key.drag.do')}</li>
          <li><strong>{t('intro.key.click')}</strong> {t('intro.key.click.do')}</li>
        </ul>
        <button className="intro-cta" onClick={() => dispatch({ type: 'intro-seen' })}>{t('intro.cta')}</button>
      </div>
    </div>
  );
}
