import { Panel } from './Panel';
import { useStore } from '../state/store';
import { useIsDesktop } from './useIsDesktop';

/** Mobile : le panneau devient une bottom sheet. */
export function Sheet() {
  const isDesktop = useIsDesktop();
  const { state } = useStore();
  if (isDesktop || !state.sel) return null;
  return (
    <div className="sheet">
      <Panel />
    </div>
  );
}
