import { Minus, Plus, LocateFixed } from 'lucide-react';
import type { MapController } from '../map/controller';
import { useLang } from '../i18n/lang';

export function ZoomControls({ controller }: { controller: MapController | null }) {
  const { t } = useLang();
  return (
    <div className="glass flex flex-col gap-1 p-1.5" role="group" aria-label={t('zoom.controls')}>
      <button className="p-2 hover:bg-black/5 rounded-lg" aria-label={t('zoom.in')} onClick={() => controller?.zoomToLevel(Math.min(3, controller.getLevel() + 1))}>
        <Plus size={18} />
      </button>
      <button className="p-2 hover:bg-black/5 rounded-lg" aria-label={t('zoom.out')} onClick={() => controller?.zoomToLevel(Math.max(0, controller.getLevel() - 1))}>
        <Minus size={18} />
      </button>
      <button className="p-2 hover:bg-black/5 rounded-lg" aria-label={t('zoom.reset')} onClick={() => controller?.reset()}>
        <LocateFixed size={18} />
      </button>
    </div>
  );
}
