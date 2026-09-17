import { useLang, type Lang } from './lang';

const LANGS: Lang[] = ['fr', 'en'];

export function LangSwitcher() {
  const { lang, setLang, t } = useLang();
  return (
    <div className="lang-switch" role="group" aria-label={t('lang.switch')}>
      {LANGS.map((l) => (
        <button
          key={l}
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
          className={`lang-btn${lang === l ? ' on' : ''}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
