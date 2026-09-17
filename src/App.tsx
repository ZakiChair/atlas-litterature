import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Link } from './data/types';
import { LangProvider } from './i18n/lang';
import { useData } from './i18n/localize';
import { computeLayout } from './map/layout';
import { MapCanvas } from './map/MapCanvas';
import { LEVEL_K } from './map/viewStore';
import { EdgeLabels } from './map/EdgeLabels';
import { boundsFor, movementOf } from './map/bounds';
import type { MapController } from './map/controller';
import { StoreProvider, useStore, type Selection } from './state/store';
import { parseHash, hashFor } from './lib/router';
import { TopBar } from './ui/TopBar';
import { FiltersDrawer, computeDimmed } from './ui/FiltersDrawer';
import { Legend } from './ui/Legend';
import { MethodModal } from './ui/MethodModal';
import { IntroOverlay } from './ui/IntroOverlay';
import { Panel } from './ui/Panel';
import { Sheet } from './ui/Sheet';
import { Breadcrumb } from './ui/Breadcrumb';
import { ZoomControls } from './ui/ZoomControls';
import { LevelIndicator } from './ui/LevelIndicator';
import { LinkPopover } from './ui/LinkPopover';
import { useIsDesktop } from './ui/useIsDesktop';

function AtlasApp() {
  const { state, dispatch } = useStore();
  const data = useData();
  const controllerRef = useRef<MapController | null>(null);
  const [controller, setController] = useState<MapController | null>(null);
  const [level, setLevel] = useState(0);
  const [methodOpen, setMethodOpen] = useState(false);
  const [popover, setPopover] = useState<{ link: Link; x: number; y: number } | null>(null);
  const nodeOk = useMemo(() => new Set(data.nodes.map((n) => `${n.kind}:${n.id}`)), [data]);
  const layout = useMemo(() => computeLayout(data.movements), [data]);
  const lastHash = useRef<string | null>(null);
  const pendingFly = useRef<Selection | null>(null);
  /** posé quand la sélection vient d'un clic carte qui ne doit pas re-voler */
  const skipNextFly = useRef(false);
  const desktop = useIsDesktop();

  const onMapReady = useCallback((c: MapController) => setController(c), []);

  const flyTo = useCallback(
    (sel: Selection) => {
      const b = boundsFor(sel, layout);
      if (!b) return;
      const isDesktop = window.innerWidth >= 900;
      // zone visible nette du panneau : 440 px à droite sur desktop, ~52 % en bas sur mobile
      const inset = isDesktop ? { right: 440 } : { bottom: Math.round(window.innerHeight * 0.52) };
      // sur mobile la sheet mange le bas : fill plus petit
      const fill = sel.kind === 'mouvement' ? (isDesktop ? 0.6 : 0.75) : 0.5;
      // plafond par kind : mouvement → « Tendances », tendance → « Auteurs »,
      // auteur/œuvre → zoom lisible sans perdre le territoire
      const maxK =
        sel.kind === 'mouvement'
          ? LEVEL_K[1] - 0.08
          : sel.kind === 'tendance'
            ? LEVEL_K[2] - 0.1
            : sel.kind === 'auteur'
              ? 2.6
              : 3.2;
      controllerRef.current?.zoomToBounds(b, fill, 900, inset, maxK);
    },
    [layout],
  );

  const handleSelect = useCallback(
    (sel: Selection | null, fly: boolean) => {
      setPopover(null);
      if (sel && !fly) skipNextFly.current = true;
      dispatch({ type: 'select', sel });
    },
    [dispatch],
  );

  // À chaque (re)montage de la carte, vole vers la sélection courante : consomme un
  // fly-to en attente (sélection initiale via URL) et résiste au double montage
  // de StrictMode, qui réinitialise le zoom après le premier vol.
  const selectionRef = useRef(state.sel);
  useEffect(() => {
    selectionRef.current = state.sel;
  }, [state.sel]);
  useEffect(() => {
    if (!controller) return;
    const sel = pendingFly.current ?? selectionRef.current;
    pendingFly.current = null;
    if (sel) flyTo(sel);
  }, [controller, flyTo]);

  // sélection → fly-to (sauf sélections venues d'un clic carte sans vol)
  useEffect(() => {
    const sel = state.sel;
    if (!sel) return;
    if (skipNextFly.current) {
      skipNextFly.current = false;
      return;
    }
    if (controllerRef.current) flyTo(sel);
    else pendingFly.current = sel;
  }, [state.sel, flyTo]);

  // hash → sélection (chargement + hashchange)
  useEffect(() => {
    const apply = () => {
      const h = window.location.hash;
      if (h === lastHash.current) return;
      lastHash.current = h;
      const parsed = parseHash(h);
      if (parsed && nodeOk.has(`${parsed.kind}:${parsed.id}`)) {
        setPopover(null);
        dispatch({ type: 'select', sel: { kind: parsed.kind, id: parsed.id } });
      } else if (!parsed) {
        dispatch({ type: 'select', sel: null });
      }
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, [dispatch, nodeOk]);

  // sélection → hash
  useEffect(() => {
    const h = state.sel ? hashFor(state.sel.kind, state.sel.id) : '#/';
    if (window.location.hash !== h) {
      lastHash.current = h;
      history.replaceState(null, '', h);
    }
  }, [state.sel]);

  // Escape → fermer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPopover(null);
        dispatch({ type: 'select', sel: null });
        dispatch({ type: 'close-ui' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch]);

  const dimmedIds = useMemo(() => computeDimmed(state.filters), [state.filters]);

  const relatedIds = useMemo(() => {
    const set = new Set<string>();
    if (!state.sel) return set;
    const mid = movementOf(state.sel);
    if (!mid) return set;
    for (const l of data.links) {
      if (l.source === mid) set.add(l.target);
      if (l.target === mid) set.add(l.source);
    }
    return set;
  }, [state.sel, data]);

  const onLinkClick = useCallback((link: Link, pos: { x: number; y: number }) => {
    setPopover({ link, x: pos.x, y: pos.y });
  }, []);

  return (
    <>
      <div className="atlas-bg" />
      <MapCanvas
        layout={layout}
        filters={state.filters}
        dimmedIds={dimmedIds}
        selection={state.sel}
        relatedIds={relatedIds}
        onSelect={handleSelect}
        onLinkClick={onLinkClick}
        controllerRef={controllerRef}
        onLevelChange={setLevel}
        onReady={onMapReady}
      />
      <EdgeLabels />
      <TopBar onMethod={() => setMethodOpen(true)} />
      <Breadcrumb />
      <FiltersDrawer />
      <Legend />
      {desktop ? <Panel /> : <Sheet />}
      {popover && <LinkPopover link={popover.link} x={popover.x} y={popover.y} onClose={() => setPopover(null)} />}
      {/* au-dessus de la gouttière des ères (48 px) ; à gauche du panneau quand il est ouvert */}
      <div
        className={`fixed z-40 ${
          state.sel ? (desktop ? 'right-[452px] bottom-[60px]' : 'right-4 top-20') : 'right-4 bottom-[60px]'
        }`}
      >
        <ZoomControls controller={controller} />
      </div>
      {(desktop || !state.sel) && (
        <div className="fixed bottom-[60px] left-4 z-40">
          <LevelIndicator level={level} controller={controller} />
        </div>
      )}
      <MethodModal open={methodOpen} onClose={() => setMethodOpen(false)} />
      <IntroOverlay />
      <div className="grain" aria-hidden="true" />
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <StoreProvider>
        <AtlasApp />
      </StoreProvider>
    </LangProvider>
  );
}
