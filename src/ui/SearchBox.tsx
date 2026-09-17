import { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { search, KIND_I18N } from '../lib/search';
import { useStore } from '../state/store';
import { hashFor } from '../lib/router';
import type { AtlasNode } from '../data/types';
import { useLang } from '../i18n/lang';
import { useData } from '../i18n/localize';

export function SearchBox() {
  const { dispatch } = useStore();
  const { t } = useLang();
  const { nodes } = useData();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const results = useMemo(() => search(q, nodes), [q, nodes]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const pick = (node: AtlasNode) => {
    dispatch({ type: 'select', sel: { kind: node.kind, id: node.id, movementId: node.movementId, tendanceId: node.tendanceId, auteurId: node.auteurId } });
    history.replaceState(null, '', hashFor(node.kind, node.id));
    setQ('');
    setOpen(false);
  };

  return (
    <div className="searchbox" ref={boxRef}>
      <Search size={15} className="search-ico" />
      <input
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setHi(0); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setHi((h) => Math.min(results.length - 1, h + 1)); }
          if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => Math.max(0, h - 1)); }
          if (e.key === 'Enter' && results[hi]) pick(results[hi].node);
          if (e.key === 'Escape') setOpen(false);
        }}
        placeholder={t('search.placeholder')}
        aria-label={t('search.aria')}
      />
      {open && q && results.length > 0 && (
        <ul className="search-results" role="listbox">
          {results.map((r, i) => {
            const header = i === 0 || r.node.kind !== results[i - 1].node.kind ? t(KIND_I18N[r.node.kind]) : null;
            return (
              <li key={`${r.node.kind}-${r.node.id}`}>
                {header && <div className="search-group">{header}</div>}
                <button
                  className={`search-item${i === hi ? ' hi' : ''}`}
                  onMouseEnter={() => setHi(i)}
                  onClick={() => pick(r.node)}
                >
                  <span className="sr-label">{r.node.label}</span>
                  {r.node.sublabel && <span className="sr-sub">{r.node.sublabel}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {open && q && results.length === 0 && (
        <ul className="search-results"><li className="search-empty">{t('search.empty').replace('{q}', q)}</li></ul>
      )}
    </div>
  );
}
