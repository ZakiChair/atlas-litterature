import { useStore } from '../state/store';
import { resolveSel } from './resolve';
import { ChevronRight } from 'lucide-react';
import { useLang } from '../i18n/lang';
import { useData } from '../i18n/localize';

export function Breadcrumb() {
  const { state, dispatch } = useStore();
  const { t } = useLang();
  const data = useData();
  const r = resolveSel(state.sel, data);
  if (!r || !state.sel) return null;

  const crumbs: { label: string; onClick?: () => void }[] = [
    {
      label: r.movement.name,
      onClick: state.sel.kind === 'mouvement' ? undefined : () =>
        dispatch({ type: 'select', sel: { kind: 'mouvement', id: r.movement.id } }),
    },
  ];
  if (state.sel.kind === 'tendance' && r.tendance) {
    crumbs.push({ label: r.tendance.name });
  } else if (state.sel.kind === 'auteur' && r.auteur) {
    if (r.tendance) {
      crumbs.push({
        label: r.tendance.name,
        onClick: () => dispatch({ type: 'select', sel: { kind: 'tendance', id: r.tendance!.id, movementId: r.movement.id } }),
      });
    }
    crumbs.push({ label: r.auteur.name });
  } else if (state.sel.kind === 'oeuvre' && r.oeuvre) {
    if (r.tendance) {
      crumbs.push({
        label: r.tendance.name,
        onClick: () => dispatch({ type: 'select', sel: { kind: 'tendance', id: r.tendance!.id, movementId: r.movement.id } }),
      });
    }
    crumbs.push({ label: r.oeuvre.title });
  }

  return (
    <nav className="breadcrumb" aria-label={t('breadcrumb.aria')}>
      {crumbs.map((c, i) => (
        <span key={i} className="crumb">
          {i > 0 && <ChevronRight size={12} />}
          {c.onClick ? <button onClick={c.onClick}>{c.label}</button> : <span className="crumb-cur">{c.label}</span>}
        </span>
      ))}
    </nav>
  );
}
