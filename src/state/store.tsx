import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import type { DomaineId, LinkKind, NodeKind } from '../data/types';
import { TIME_BOUNDS } from '../data/eras';

export interface Selection {
  kind: NodeKind;
  id: string;
  /** Pour les nœuds enfants : le mouvement parent. */
  movementId?: string;
  tendanceId?: string;
  auteurId?: string;
}

export interface Filters {
  period: [number, number];
  domaines: DomaineId[];
  linkKinds: Record<LinkKind, boolean>;
}

interface UiState {
  filtersOpen: boolean;
  legendOpen: boolean;
  introSeen: boolean;
  linkPopover: { link: LinkKind; x: number; y: number } | null;
}

export interface State {
  sel: Selection | null;
  filters: Filters;
  ui: UiState;
}

export type Action =
  | { type: 'select'; sel: Selection | null }
  | { type: 'set-period'; period: [number, number] }
  | { type: 'toggle-domaine'; domaine: DomaineId }
  | { type: 'set-domaines'; domaines: DomaineId[] }
  | { type: 'toggle-link-kind'; kind: LinkKind }
  | { type: 'reset-filters' }
  | { type: 'toggle-ui'; key: 'filtersOpen' | 'legendOpen' }
  | { type: 'close-ui' }
  | { type: 'intro-seen' };

const initialFilters: Filters = {
  period: [TIME_BOUNDS.start, TIME_BOUNDS.end],
  domaines: [],
  linkKinds: { filiation: true, influence: true, affinite: true, reaction: true },
};

const initial: State = {
  sel: null,
  filters: initialFilters,
  ui: { filtersOpen: false, legendOpen: false, introSeen: false, linkPopover: null },
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'select':
      return { ...state, sel: action.sel };
    case 'set-period':
      return { ...state, filters: { ...state.filters, period: action.period } };
    case 'toggle-domaine': {
      const has = state.filters.domaines.includes(action.domaine);
      const domaines = has
        ? state.filters.domaines.filter((d) => d !== action.domaine)
        : [...state.filters.domaines, action.domaine];
      return { ...state, filters: { ...state.filters, domaines } };
    }
    case 'set-domaines':
      return { ...state, filters: { ...state.filters, domaines: action.domaines } };
    case 'toggle-link-kind':
      return {
        ...state,
        filters: {
          ...state.filters,
          linkKinds: { ...state.filters.linkKinds, [action.kind]: !state.filters.linkKinds[action.kind] },
        },
      };
    case 'reset-filters':
      return { ...state, filters: initialFilters };
    case 'toggle-ui':
      return { ...state, ui: { ...state.ui, [action.key]: !state.ui[action.key] } };
    case 'close-ui':
      return { ...state, ui: { ...state.ui, filtersOpen: false, legendOpen: false } };
    case 'intro-seen':
      return { ...state, ui: { ...state.ui, introSeen: true } };
    default:
      return state;
  }
}

const Ctx = createContext<{ state: State; dispatch: React.Dispatch<Action> }>({
  state: initial,
  dispatch: () => {},
});

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// oxlint-disable-next-line react/only-export-components
export function useStore() {
  return useContext(Ctx);
}
