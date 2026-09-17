import { memo } from 'react';
import { useViewTransform } from './viewStore';
import { eraLabels, domaineLabels } from './edgeLabelsLayout';
import { useLang } from '../i18n/lang';
import { useData } from '../i18n/localize';

/** Marges de la carte : noms de domaines à gauche, ères en bas, en espace écran. */
export const EdgeLabels = memo(function EdgeLabels() {
  const v = useViewTransform();
  const { t } = useLang();
  const { eras, domaines } = useData();
  const domaineLabelsOut = domaineLabels(v, domaines);
  const eraLabelsOut = eraLabels(v, eras, t('period.today'));
  return (
    <div className="edge-labels" aria-hidden="true">
      {domaineLabelsOut.map((l) => (
        <span key={l.id} className="edge-domaine" style={{ top: l.pos }}>
          {l.lines[0]}
        </span>
      ))}
      {eraLabelsOut.map((l) => (
        <span key={l.id} className="edge-era" style={{ left: l.pos }}>
          <span className="edge-era-name">{l.lines[0]}</span>
          <span className="edge-era-range">{l.lines[1]}</span>
        </span>
      ))}
    </div>
  );
});
