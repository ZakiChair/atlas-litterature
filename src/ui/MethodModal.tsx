import { X } from 'lucide-react';
import { useLang } from '../i18n/lang';

export function MethodModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang();
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal panel-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label={t('method.close')}><X size={14} /></button>
        <h3>{t('method.title')}</h3>
        {t('method.body').split('\n\n').map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
