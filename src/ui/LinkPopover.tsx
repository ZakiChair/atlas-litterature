import { useEffect, useRef } from 'react';
import type { Link } from '../data/types';
import { useStore } from '../state/store';
import { useLang } from '../i18n/lang';
import { useData, LINK_KIND_I18N } from '../i18n/localize';

export function LinkPopover({ link, x, y, onClose }: { link: Link; x: number; y: number; onClose: () => void }) {
  const { dispatch } = useStore();
  const { t } = useLang();
  const { movementById } = useData();
  const ref = useRef<HTMLDivElement>(null);
  const src = movementById[link.source];
  const dst = movementById[link.target];

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [onClose]);

  if (!src || !dst) return null;
  return (
    <div ref={ref} className="link-popover panel-card" role="dialog" aria-label={t('popover.aria')} style={{ left: Math.min(x, window.innerWidth - 300), top: Math.max(70, y - 60) }}>
      <p className={`pop-kind kind-${link.kind}`}>{t(LINK_KIND_I18N[link.kind])}</p>
      <p className="pop-title">
        <button onClick={() => { dispatch({ type: 'select', sel: { kind: 'mouvement', id: src.id } }); onClose(); }}>{src.name}</button>
        <span> → </span>
        <button onClick={() => { dispatch({ type: 'select', sel: { kind: 'mouvement', id: dst.id } }); onClose(); }}>{dst.name}</button>
      </p>
      <p className="pop-label">{link.label}</p>
      <p className="pop-note">{link.note}</p>
    </div>
  );
}
