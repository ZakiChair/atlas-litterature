import { memo, useMemo, type CSSProperties } from 'react';
import type { Movement, Period } from '../data/types';
import { organicPath, type TerritoryLayout } from './layout';
import { LITE } from './lite';
import { levelFor, useViewTransform } from './viewStore';
import { useLang, type Lang } from '../i18n/lang';
import { UI } from '../i18n/ui';

export function formatPeriod(p: Period | undefined, lang: Lang): string {
  if (!p) return '';
  const ca = p.approx ? UI[lang]['period.ca'] : '';
  const end = p.end === null ? UI[lang]['period.today'] : String(p.end);
  return `${ca}${p.start} – ${end}`;
}

const MAX_LINE = 15;
const MAX_LINES = 3;

/** Coupe un texte en lignes ≤ maxLine caractères (aux espaces), maxLines max. */
function wrapWords(text: string, maxLine: number, maxLines: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length <= maxLine) {
      cur = next;
    } else {
      if (cur) lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    const head = lines.slice(0, maxLines - 1);
    head.push(lines.slice(maxLines - 1).join(' '));
    return head;
  }
  return lines;
}

/** Coupe le nom en lignes ≤ ~15 caractères (aux espaces), 3 lignes max. */
function wrapName(name: string): string[] {
  return wrapWords(name.toUpperCase(), MAX_LINE, MAX_LINES);
}

/** Nom court d'une tendance pour la carte : la partie avant « : » (le détail reste dans le panneau). */
function shortTendanceName(name: string): string {
  return name.split(' : ')[0].replace(/\s*\([^)]*\)\s*$/, '').trim();
}

interface Props {
  movement: Movement;
  layout: TerritoryLayout;
  selected: boolean;
  selectedChildId?: string;
  dimmed: boolean;
  related: boolean;
  onSelect: (kind: 'mouvement' | 'tendance' | 'auteur' | 'oeuvre', id: string, territory: TerritoryLayout) => void;
  onHover?: (id: string | null) => void;
}

export const Territory = memo(function Territory({ movement, layout, selected, selectedChildId, dimmed, related, onSelect, onHover }: Props) {
  const { lang } = useLang();
  const { x, y, r } = layout;
  const palette = movement.map.palette;

  // Re-rendu à chaque frame de zoom/pan (léger : tests booléens seulement) pour
  // ne monter dans le DOM que les enfants du niveau courant ET visibles à
  // l'écran — sans ça, des centaines de nœuds masqués (opacity:0) pèseraient.
  const v = useViewTransform();
  const lvl = levelFor(v.k);
  const PAD = 220; // px écran : les libellés débordent sans apparaître brutalement
  const inView = (cx: number, cy: number) => {
    const sx = v.x + cx * v.k;
    const sy = v.y + cy * v.k;
    return sx > -PAD && sx < v.width + PAD && sy > -PAD && sy < v.height + PAD;
  };
  const showTendances = lvl >= 1;
  const showAuteurs = lvl >= 2;
  const showOeuvres = lvl >= 3;

  const tendanceById = useMemo(() => new Map(movement.tendances.map((t) => [t.id, t])), [movement]);
  const auteurById = useMemo(() => new Map(movement.auteurs.map((a) => [a.id, a])), [movement]);
  const oeuvreById = useMemo(() => new Map(movement.oeuvres.map((o) => [o.id, o])), [movement]);

  const cls = `territory${selected ? ' selected' : ''}${dimmed ? ' dimmed' : ''}${related ? ' related' : ''}`;

  // nom : lignes + taille en unités carte pour tenir dans ≈1.55 r
  const lines = wrapName(movement.name);
  const longest = Math.max(...lines.map((l) => l.length), 1);
  const fs = Math.min(0.19 * r, (1.55 * r) / (longest * 0.62));
  // interligne en em : suit la taille effective (réduite par CSS aux niveaux ≥ 1)
  const lineH = fs * 1.05;
  const nameTop = y - ((lines.length - 1) * lineH) / 2 - (lines.length > 0 ? fs * 0.1 : 0);

  const vars = {
    '--fs': String(fs),
    '--r': String(r),
    '--accent': palette.accent,
  } as CSSProperties;

  return (
    <g
      className={cls}
      data-testid="territory"
      data-id={movement.id}
      style={vars}
      tabIndex={0}
      role="button"
      aria-label={movement.name}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          onSelect('mouvement', movement.id, layout);
        }
      }}
      onMouseDown={(e) => e.preventDefault()}
      onMouseEnter={() => onHover?.(movement.id)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(movement.id)}
      onBlur={() => onHover?.(null)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect('mouvement', movement.id, layout);
      }}
    >
      {/* halo de sélection — flou coûteux : réservé au desktop ; sur mobile,
          monté seulement à la sélection et sans flou */}
      {(selected || !LITE) && (
        <path
          className="halo"
          d={layout.path}
          fill="none"
          stroke={palette.accent}
          strokeWidth={10}
          filter={LITE ? undefined : 'url(#halo-blur)'}
        />
      )}
      {/* aplat + grain papier (feTurbulence : desktop seulement) */}
      <path className="fill" d={layout.path} fill={palette.fill} fillOpacity={0.55} filter={LITE ? undefined : 'url(#paper-grain)'} />
      <path className="edge" d={layout.path} fill="none" stroke={palette.stroke} strokeWidth={selected ? 3.4 : 1.8} strokeOpacity={0.9} />
      {/* isoligne pointillée (même forme, r + 18) */}
      <path d={layout.isoPath} fill="none" stroke={palette.stroke} strokeWidth={1} strokeOpacity={0.4} strokeDasharray="5 7" />
      <title>{movement.name}</title>

      <g className="territory-labels">
        <text className="territory-name" x={x} y={nameTop} textAnchor="middle">
          {lines.map((l, i) => (
            <tspan key={i} x={x} dy={i === 0 ? 0 : '1.05em'}>
              {l}
            </tspan>
          ))}
        </text>
        <text className="territory-period" x={x} y={nameTop + lines.length * lineH - fs * 0.1}>
          {formatPeriod(movement.period, lang)}
        </text>
      </g>

      {/* tendances — niveau 1 */}
      <g className="layer layer-1">
        {showTendances &&
          layout.children
          .filter((c) => c.kind === 'tendance' && inView(c.x, c.y))
          .map((c) => {
            const t = tendanceById.get(c.id);
            if (!t) return null;
            const blob = organicPath(c.x, c.y, r * 0.2, `tendance:${c.id}`, 0.22);
            return (
              <g key={c.id}>
                <path d={blob} fill={palette.accent} fillOpacity={0.16} stroke={palette.accent} strokeOpacity={0.5} strokeWidth={1.2} />
                <text className="child-label tendance-label" x={c.x} y={c.y} fill={palette.accent}>
                  {wrapWords(shortTendanceName(t.name), 18, 2).map((l, i, arr) => (
                    <tspan key={i} x={c.x} dy={i === 0 ? `${-(arr.length - 1) * 0.55}em` : '1.1em'}>
                      {l}
                    </tspan>
                  ))}
                </text>
                <circle
                  className="child-hit"
                  cx={c.x}
                  cy={c.y}
                  r={r * 0.22}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect('tendance', t.id, layout);
                  }}
                >
                  <title>
                    {t.name}
                    {t.period ? ` · ${formatPeriod(t.period, lang)}` : ''}
                  </title>
                </circle>
              </g>
            );
          })}
      </g>

      {/* auteurs — niveau 2 */}
      <g className="layer layer-2">
        {showAuteurs &&
          layout.children
          .filter((c) => c.kind === 'auteur' && inView(c.x, c.y))
          .map((c) => {
            const a = auteurById.get(c.id);
            if (!a) return null;
            const isSel = selectedChildId === a.id;
            return (
              <g key={c.id}>
                <circle
                  className="marker-auteur"
                  cx={c.x}
                  cy={c.y}
                  fill={isSel ? palette.accent : '#ffffff'}
                  fillOpacity={isSel ? 1 : 0.9}
                  stroke={isSel ? '#fff' : palette.accent}
                  style={{ r: isSel ? 'calc(8px / var(--k))' : 'calc(6px / var(--k))' }}
                />
                <text className="child-label auteur-label" x={c.x} y={c.y} dy={c.vside === 'below' ? '1.7em' : '-0.9em'}>
                  {a.name}
                </text>
                <circle
                  className="child-hit"
                  cx={c.x}
                  cy={c.y}
                  r={Math.max(14, r * 0.08)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect('auteur', a.id, layout);
                  }}
                >
                  <title>
                    {a.name}
                    {a.years[0] != null ? ` (${a.years[0]} – ${a.years[1] ?? '…'})` : ''}
                  </title>
                </circle>
              </g>
            );
          })}
      </g>

      {/* œuvres — niveau 3 */}
      <g className="layer layer-3">
        {showOeuvres &&
          layout.children
          .filter((c) => c.kind === 'oeuvre' && inView(c.x, c.y))
          .map((c) => {
            const o = oeuvreById.get(c.id);
            if (!o) return null;
            const isSel = selectedChildId === o.id;
            const s = 14;
            const d = `M ${c.x} ${c.y - s} L ${c.x + s} ${c.y} L ${c.x} ${c.y + s} L ${c.x - s} ${c.y} Z`;
            return (
              <g key={c.id}>
                <path
                  className="oeuvre-diamond"
                  d={d}
                  fill={isSel ? '#b3446a' : palette.accent}
                  fillOpacity={0.9}
                  stroke="#fff"
                  style={{ transform: 'scale(calc(0.7 / var(--k)))', transformBox: 'fill-box', transformOrigin: 'center' }}
                />
                <text
                  className="child-label oeuvre-label"
                  x={c.x}
                  y={c.y}
                  style={{ textAnchor: c.anchor ?? 'middle' }}
                  dx={c.anchor === 'start' ? '0.9em' : c.anchor === 'end' ? '-0.9em' : 0}
                  dy={c.anchor && c.anchor !== 'middle' ? '0.35em' : '1.6em'}
                >
                  {o.title}{o.year ? ` (${o.year})` : ''}
                </text>
                <circle
                  className="child-hit"
                  cx={c.x}
                  cy={c.y}
                  r={Math.max(10, r * 0.05)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect('oeuvre', o.id, layout);
                  }}
                >
                  <title>
                    {o.title}{o.year ? ` (${o.year})` : ''}
                  </title>
                </circle>
              </g>
            );
          })}
      </g>
    </g>
  );
});
