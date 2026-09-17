import type { MapController } from '../map/controller';
import { useLang } from '../i18n/lang';
import { LEVEL_I18N } from '../i18n/localize';

export function LevelIndicator({ level, controller }: { level: number; controller: MapController | null }) {
  const { t } = useLang();
  return (
    <div className="glass px-3 py-2 text-xs text-[var(--ink-dim)]" role="navigation" aria-label={t('level.aria')}>
      {LEVEL_I18N.map((key, i) => (
        <span key={key}>
          {i > 0 && <span className="mx-1 opacity-50">·</span>}
          <button
            className={i === level ? 'text-[var(--rose-deep)] font-bold' : 'hover:text-[var(--ink)]'}
            onClick={() => controller?.zoomToLevel(i)}
          >
            {t(key)}
          </button>
        </span>
      ))}
    </div>
  );
}
