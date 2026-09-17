/**
 * Génère src/i18n/en-data.ts : surcouche anglaise du corpus.
 *
 * Textes FR traduits par MiniMax (`mmx text chat`), par lots, avec cache par
 * empreinte du texte source (scripts/.cache/i18n-en.json). Toute clé absente
 * retombe sur le français à l'affichage.
 *
 * Usage : npx tsx scripts/i18n-generate.ts [--limit N] [--dry]
 */
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { MOVEMENTS } from '../src/data';
import { LINKS } from '../src/data/links';
import { ERAS, DOMAINES } from '../src/data/eras';

const CACHE_DIR = new URL('./.cache/', import.meta.url).pathname;
const TR_CACHE = CACHE_DIR + 'i18n-en.json';
const OUT_FILE = new URL('../src/i18n/en-data.ts', import.meta.url).pathname;
const BATCH = 40;
const CONCURRENCY = 4;
const MMX_TIMEOUT = 180_000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const hash = (s: string) => createHash('sha1').update(s, 'utf8').digest('hex').slice(0, 16);

// ——— collecte : texte → empreinte ———

type TrCache = Record<string, { text: string; en: string }>;
const trCache: TrCache = existsSync(TR_CACHE) ? JSON.parse(readFileSync(TR_CACHE, 'utf8')) : {};
const todoTexts = new Map<string, string>(); // hash → texte

function collect(text: string | undefined | null) {
  if (!text) return;
  const t = text.trim();
  if (!t) return;
  const h = hash(t);
  if (!trCache[h]) todoTexts.set(h, t);
}

function collectAll() {
  for (const e of ERAS) {
    collect(e.name);
    collect(e.tagline);
  }
  for (const d of DOMAINES) {
    collect(d.name);
    collect(d.shortName);
  }
  for (const m of MOVEMENTS) {
    collect(m.name);
    m.altNames?.forEach(collect);
    collect(m.tagline);
    collect(m.summary);
    m.keyDates.forEach((k) => collect(k.text));
    for (const t of m.tendances) {
      collect(t.name);
      collect(t.summary);
      t.traits.forEach(collect);
    }
    for (const a of m.auteurs) {
      collect(a.bio);
      collect(a.qualite);
    }
    for (const o of m.oeuvres) {
      collect(o.comment);
      if (o.auteurName === 'Anonyme' || o.auteurName === 'Collectif') continue;
      collect(o.auteurName);
    }
  }
  for (const l of LINKS) {
    collect(l.label);
    collect(l.note);
  }
}

// ——— MiniMax ———

const SYSTEM = `Tu es un traducteur FR→EN spécialisé en littérature française et histoire littéraire.
On te donne un objet JSON {"items":[{"id","text"}]} de textes français.
Réponds UNIQUEMENT par un JSON valide {"items":[{"id","en"}]} : même ordre, mêmes id, traduction anglaise naturelle et précise.
Règles :
- Ne traduis pas les noms de personnes ; les titres d'œuvres cités gardent leur titre original français, sauf titre anglais consacré (« Les Essais » → « the Essays »).
- Les noms de mouvements gardent la forme consacrée en anglais quand elle existe (« Les Lumières » → « the Enlightenment », « La Pléiade » → « La Pléiade »).
- Préserve la ponctuation typographique simple ; pas de guillemets français « » dans l'anglais.
- Ton concis, encyclopédique.`;

async function mmxTranslate(batch: { id: string; text: string }[]): Promise<Record<string, string>> {
  const messages = JSON.stringify([
    { role: 'system', content: SYSTEM },
    { role: 'user', content: JSON.stringify({ items: batch }) },
  ]);
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const out = await new Promise<string>((resolve, reject) => {
        const p = execFile('mmx', ['text', 'chat', '--messages-file', '-', '--output', 'json', '--max-tokens', '16000', '--temperature', '0.2', '--non-interactive'], { timeout: MMX_TIMEOUT, maxBuffer: 16 * 1024 * 1024 }, (err, stdout) => {
          if (err) reject(err);
          else resolve(stdout);
        });
        p.stdin?.end(messages);
      });
      const parsed = JSON.parse(out);
      const text: string = parsed?.content?.[0]?.text ?? '';
      const json = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));
      const items: { id: string; en: string }[] = json.items ?? [];
      const map: Record<string, string> = {};
      for (const it of items) if (it.id && typeof it.en === 'string') map[it.id] = it.en.trim();
      if (Object.keys(map).length >= Math.ceil(batch.length * 0.8)) return map;
      throw new Error(`réponse incomplète (${Object.keys(map).length}/${batch.length})`);
    } catch (e) {
      if (attempt === 2) {
        const map: Record<string, string> = {};
        for (const item of batch) {
          try {
            const single = await mmxTranslate([item]);
            Object.assign(map, single);
          } catch {
            /* texte non traduit : repli FR */
          }
        }
        return map;
      }
      await sleep(1500 * (attempt + 1));
    }
  }
  return {};
}

async function translateAll(limit: number, dry: boolean) {
  const todo = [...todoTexts.entries()].slice(0, limit);
  console.log(`${todoTexts.size} textes uniques à traduire (${Object.keys(trCache).length} en cache)`);
  if (dry) return;
  const batches: { id: string; text: string }[][] = [];
  for (let i = 0; i < todo.length; i += BATCH) batches.push(todo.slice(i, i + BATCH).map(([id, text]) => ({ id, text })));
  let done = 0;
  const queue = [...batches];
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const b = queue.shift()!;
      const map = await mmxTranslate(b);
      for (const { id, text } of b) {
        if (map[id]) trCache[id] = { text, en: map[id] };
      }
      done++;
      if (done % 5 === 0 || done === batches.length) {
        console.log(`  ${done}/${batches.length} lots`);
        writeFileSync(TR_CACHE, JSON.stringify(trCache));
      }
      await sleep(200);
    }
  });
  await Promise.all(workers);
  writeFileSync(TR_CACHE, JSON.stringify(trCache));
  const missing = [...todoTexts.keys()].filter((h) => !trCache[h]);
  if (missing.length) console.warn(`  ! ${missing.length} textes sans traduction (repli FR)`);
}

// ——— émission ———

const tr = (text: string | undefined): string | undefined => {
  if (!text) return undefined;
  return trCache[hash(text)]?.en;
};
const trAll = (arr: string[] | undefined): string[] | undefined => arr?.map((x) => tr(x) ?? x);

function emit() {
  const movements = Object.fromEntries(
    MOVEMENTS.map((m) => [
      m.id,
      {
        name: tr(m.name),
        altNames: trAll(m.altNames),
        tagline: tr(m.tagline),
        summary: tr(m.summary),
        keyDates: trAll(m.keyDates.map((k) => k.text)),
        tendances: Object.fromEntries(
          m.tendances.map((t) => [t.id, { name: tr(t.name), summary: tr(t.summary), traits: trAll(t.traits) }]),
        ),
        auteurs: Object.fromEntries(
          m.auteurs.map((a) => [a.id, { bio: tr(a.bio), qualite: tr(a.qualite) }]),
        ),
        oeuvres: Object.fromEntries(
          m.oeuvres.map((o) => [
            o.id,
            {
              comment: tr(o.comment),
              auteurName: o.auteurName === 'Anonyme' || o.auteurName === 'Collectif' ? undefined : tr(o.auteurName),
            },
          ]),
        ),
      },
    ]),
  );
  const links = Object.fromEntries(
    LINKS.map((l) => [`${l.source}|${l.target}|${l.kind}`, { label: tr(l.label), note: tr(l.note) }]),
  );
  const eras = Object.fromEntries(ERAS.map((e) => [e.id, { name: tr(e.name), tagline: tr(e.tagline) }]));
  const domaines = Object.fromEntries(DOMAINES.map((d) => [d.id, { name: tr(d.name), shortName: tr(d.shortName) }]));

  const body = JSON.stringify({ eras, domaines, movements, links }, null, 1);
  const file = `// Généré par scripts/i18n-generate.ts — traduction EN (MiniMax).
// Ne pas éditer à la main : relancer le script. Toute clé absente retombe sur le français.
import type { EnData } from './en';

export const EN_DATA: EnData = ${body};
`;
  writeFileSync(OUT_FILE, file);
  console.log(`écrit ${OUT_FILE} (${(body.length / 1024).toFixed(0)} Ko)`);
}

async function main() {
  const args = process.argv.slice(2);
  const limit = args.includes('--limit') ? Number(args[args.indexOf('--limit') + 1]) : Infinity;
  const dry = args.includes('--dry');
  mkdirSync(CACHE_DIR, { recursive: true });
  collectAll();
  await translateAll(limit, dry);
  if (!dry) emit();
}

main();
