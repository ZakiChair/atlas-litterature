import { useStore } from '../state/store';
import { resolveSel } from './resolve';
import { linksFor } from '../map/links';
import { X, ArrowRight } from 'lucide-react';
import type { Movement } from '../data/types';
import { useLang } from '../i18n/lang';
import { useData, LINK_KIND_I18N } from '../i18n/localize';
import { GENRE_I18N } from '../i18n/ui';

const KIND_ORDER = { filiation: 0, influence: 1, affinite: 2, reaction: 3 };

export function Panel() {
  const { state, dispatch } = useStore();
  const data = useData();
  const r = resolveSel(state.sel, data);
  if (!r || !state.sel) return null;
  const close = () => dispatch({ type: 'select', sel: null });
  const m = r.movement;

  if (state.sel.kind === 'tendance' && r.tendance) {
    return <TendanceView m={m} close={close} />;
  }
  if (state.sel.kind === 'auteur' && r.auteur) {
    return <AuteurView m={m} close={close} />;
  }
  if (state.sel.kind === 'oeuvre' && r.oeuvre) {
    return <OeuvreView m={m} close={close} />;
  }
  return <MovementView m={m} close={close} />;
}

function Shell({ children, close }: { children: React.ReactNode; close: () => void }) {
  const { t } = useLang();
  return (
    <aside className="panel" role="complementary">
      <button className="close-btn panel-close" onClick={close} aria-label={t('panel.close')}><X size={16} /></button>
      {children}
    </aside>
  );
}

function usePeriodText() {
  const { t } = useLang();
  return (m: Movement) => {
    const end = m.period.end == null ? t('period.today') : String(m.period.end);
    return `${m.period.start} – ${end}${m.period.approx ? ` ${t('panel.approxBounds')}` : ''}`;
  };
}

function MovementView({ m, close }: { m: Movement; close: () => void }) {
  const { dispatch } = useStore();
  const { t } = useLang();
  const data = useData();
  const periodText = usePeriodText();
  const links = linksFor(m.id, data.links).sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind]);
  const era = data.eras.find((e) => e.id === m.era)!;
  return (
    <Shell close={close}>
      <header className="panel-head">
        <p className="eyebrow">{era.name} · {m.domaines.map((d) => data.domaines.find((dd) => dd.id === d)?.shortName ?? data.domaines.find((dd) => dd.id === d)?.name ?? d).join(' · ')}</p>
        <h2>{m.name}</h2>
        {m.altNames && <p className="alt">{m.altNames.join(' · ')}</p>}
        <p className="dates">{periodText(m)}</p>
        <p className="tagline">{m.tagline}</p>
      </header>

      <section>
        <h3>{t('panel.brief')}</h3>
        <p>{m.summary}</p>
      </section>

      <section>
        <h3>{t('panel.keyDates')}</h3>
        <ul className="keydates">
          {m.keyDates.map((kd) => (
            <li key={kd.year}><span className="kd-year">{kd.year}</span> {kd.text}</li>
          ))}
        </ul>
      </section>

      {m.tendances.length > 0 && (
        <section>
          <h3>{t('panel.tendances')}</h3>
          <div className="card-list">
            {m.tendances.map((td) => (
              <button
                key={td.id}
                className="mini-card"
                onClick={() => dispatch({ type: 'select', sel: { kind: 'tendance', id: td.id, movementId: m.id } })}
              >
                <strong>{td.name}</strong>
                <span>{td.summary}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3>{t('panel.authors')}</h3>
        <ul className="author-list">
          {m.auteurs.map((a) => (
            <li key={a.id}>
              <button
                className="author-item"
                onClick={() => dispatch({ type: 'select', sel: { kind: 'auteur', id: a.id, movementId: m.id } })}
              >
                <strong>{a.name}</strong>
                <span className="author-meta">
                  {a.years[0] != null ? `${a.years[0]}–${a.years[1] ?? '…'} · ` : ''}{a.qualite}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>{t('panel.works')}</h3>
        <div className="card-list">
          {m.oeuvres.map((o) => (
            <button
              key={o.id}
              className="mini-card oeuvre-card"
              onClick={() => dispatch({ type: 'select', sel: { kind: 'oeuvre', id: o.id, movementId: m.id } })}
            >
              <strong>{o.title}{o.year ? ` (${o.year})` : ''}</strong>
              <span className="oc-author">{o.auteurName}</span>
              <span>{o.comment}</span>
            </button>
          ))}
        </div>
      </section>

      {links.length > 0 && (
        <section>
          <h3>{t('panel.links')}</h3>
          <ul className="link-list">
            {links.map((l, i) => {
              const other = data.movementById[l.isOut ? l.target : l.source];
              if (!other) return null;
              return (
                <li key={i}>
                  <button
                    className={`link-chip kind-${l.kind}`}
                    onClick={() => dispatch({ type: 'select', sel: { kind: 'mouvement', id: other.id } })}
                  >
                    <span className="chip-kind">{t(LINK_KIND_I18N[l.kind])} {l.isOut ? '→' : '←'}</span>
                    <span className="chip-label">{other.name}</span>
                    <span className="chip-note">{l.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </Shell>
  );
}

function TendanceView({ m, close }: { m: Movement; close: () => void }) {
  const { state, dispatch } = useStore();
  const { t } = useLang();
  const data = useData();
  const r = resolveSel(state.sel, data);
  const td = r?.tendance;
  if (!td) return null;
  const auteurs = m.auteurs.filter((a) => a.tendanceId === td.id);
  const oeuvres = m.oeuvres.filter((o) => o.tendanceId === td.id);
  return (
    <Shell close={close}>
      <header className="panel-head">
        <p className="eyebrow">{t('panel.kind.tendance')} · <button className="inline-back" onClick={() => dispatch({ type: 'select', sel: { kind: 'mouvement', id: m.id } })}>{m.name}</button></p>
        <h2>{td.name}</h2>
        {td.period && <p className="dates">{td.period.start} – {td.period.end ?? '…'}</p>}
      </header>
      <section><p>{td.summary}</p></section>
      {td.traits.length > 0 && (
        <section>
          <div className="trait-chips">
            {td.traits.map((tr) => <span key={tr} className="chip">{tr}</span>)}
          </div>
        </section>
      )}
      {auteurs.length > 0 && (
        <section>
          <h3>{t('panel.authorsShort')}</h3>
          <ul className="author-list">
            {auteurs.map((a) => (
              <li key={a.id}>
                <button className="author-item" onClick={() => dispatch({ type: 'select', sel: { kind: 'auteur', id: a.id, movementId: m.id } })}>
                  <strong>{a.name}</strong>
                  <span className="author-meta">{a.qualite}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
      {oeuvres.length > 0 && (
        <section>
          <h3>{t('panel.worksShort')}</h3>
          <div className="card-list">
            {oeuvres.map((o) => (
              <button key={o.id} className="mini-card" onClick={() => dispatch({ type: 'select', sel: { kind: 'oeuvre', id: o.id, movementId: m.id } })}>
                <strong>{o.title}{o.year ? ` (${o.year})` : ''}</strong>
                <span className="oc-author">{o.auteurName}</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </Shell>
  );
}

function AuteurView({ m, close }: { m: Movement; close: () => void }) {
  const { state, dispatch } = useStore();
  const { t } = useLang();
  const data = useData();
  const r = resolveSel(state.sel, data);
  const a = r?.auteur;
  if (!a) return null;
  const oeuvres = m.oeuvres.filter((o) => o.auteurId === a.id);
  const others = data.movements.filter((mm) => mm.id !== m.id && mm.auteurs.some((x) => x.id === a.id));
  return (
    <Shell close={close}>
      <header className="panel-head">
        <p className="eyebrow">{t('panel.kind.auteur')} · <button className="inline-back" onClick={() => dispatch({ type: 'select', sel: { kind: 'mouvement', id: m.id } })}>{m.name}</button></p>
        <h2>{a.name}</h2>
        <p className="dates">{a.years[0] != null ? `${a.years[0]} – ${a.years[1] ?? t('period.today')}` : t('panel.anonymous')} · {a.qualite}</p>
      </header>
      <section><p>{a.bio}</p></section>
      {r?.tendance && (
        <section>
          <h3>{t('panel.tendance')}</h3>
          <button className="mini-card" onClick={() => dispatch({ type: 'select', sel: { kind: 'tendance', id: r.tendance!.id, movementId: m.id } })}>
            <strong>{r.tendance.name}</strong>
            <span>{r.tendance.summary}</span>
          </button>
        </section>
      )}
      {oeuvres.length > 0 && (
        <section>
          <h3>{t('panel.worksShort')}</h3>
          <div className="card-list">
            {oeuvres.map((o) => (
              <button key={o.id} className="mini-card" onClick={() => dispatch({ type: 'select', sel: { kind: 'oeuvre', id: o.id, movementId: m.id } })}>
                <strong>{o.title}{o.year ? ` (${o.year})` : ''}</strong>
                <span>{o.comment}</span>
              </button>
            ))}
          </div>
        </section>
      )}
      {others.length > 0 && (
        <section>
          <h3>{t('panel.alsoIn')}</h3>
          <ul className="link-list">
            {others.map((om) => (
              <li key={om.id}>
                <button className="link-chip" onClick={() => dispatch({ type: 'select', sel: { kind: 'auteur', id: a.id, movementId: om.id } })}>
                  <span className="chip-label">{om.name}</span>
                  <ArrowRight size={12} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Shell>
  );
}

function OeuvreView({ m, close }: { m: Movement; close: () => void }) {
  const { state, dispatch } = useStore();
  const { t } = useLang();
  const data = useData();
  const r = resolveSel(state.sel, data);
  const o = r?.oeuvre;
  if (!o) return null;
  const auteur = o.auteurId ? m.auteurs.find((a) => a.id === o.auteurId) : undefined;
  const siblings = m.oeuvres.filter((x) => x.id !== o.id).slice(0, 4);
  return (
    <Shell close={close}>
      <header className="panel-head">
        <p className="eyebrow">{t('panel.kind.oeuvre')} · <button className="inline-back" onClick={() => dispatch({ type: 'select', sel: { kind: 'mouvement', id: m.id } })}>{m.name}</button></p>
        <h2>{o.title}</h2>
        <p className="dates">
          {o.year ?? t('panel.noDate')} · {t(GENRE_I18N[o.genre])}
          {auteur && <> · <button className="inline-back" onClick={() => dispatch({ type: 'select', sel: { kind: 'auteur', id: auteur.id, movementId: m.id } })}>{auteur.name}</button></>}
        </p>
      </header>
      <section><p>{o.comment}</p></section>
      {r?.tendance && (
        <section>
          <h3>{t('panel.tendance')}</h3>
          <button className="mini-card" onClick={() => dispatch({ type: 'select', sel: { kind: 'tendance', id: r.tendance!.id, movementId: m.id } })}>
            <strong>{r.tendance.name}</strong>
          </button>
        </section>
      )}
      {siblings.length > 0 && (
        <section>
          <h3>{t('panel.otherWorks')}</h3>
          <div className="card-list">
            {siblings.map((x) => (
              <button key={x.id} className="mini-card" onClick={() => dispatch({ type: 'select', sel: { kind: 'oeuvre', id: x.id, movementId: m.id } })}>
                <strong>{x.title}{x.year ? ` (${x.year})` : ''}</strong>
                <span className="oc-author">{x.auteurName}</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </Shell>
  );
}
