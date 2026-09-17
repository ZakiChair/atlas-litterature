/**
 * Rattrapage unitaire : traduit un par un les textes absents du cache
 * (les lots qui échouent en masse passent mieux isolés). Réécrit ensuite en-data.ts
 * via i18n-generate.
 */
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { MOVEMENTS } from '../src/data';
import { LINKS } from '../src/data/links';
import { ERAS, DOMAINES } from '../src/data/eras';

const CACHE = 'scripts/.cache/i18n-en.json';
const cache: Record<string, { text: string; en: string }> = JSON.parse(readFileSync(CACHE, 'utf8'));
const h = (s: string) => createHash('sha1').update(s, 'utf8').digest('hex').slice(0, 16);

const missing: string[] = [];
const collect = (t?: string | null) => {
  if (t && t.trim() && !cache[h(t.trim())]) missing.push(t.trim());
};
for (const e of ERAS) { collect(e.name); collect(e.tagline); }
for (const d of DOMAINES) { collect(d.name); collect(d.shortName); }
for (const m of MOVEMENTS) {
  collect(m.name); m.altNames?.forEach(collect); collect(m.tagline); collect(m.summary);
  m.keyDates.forEach((k) => collect(k.text));
  for (const t of m.tendances) { collect(t.name); collect(t.summary); t.traits.forEach(collect); }
  for (const a of m.auteurs) { collect(a.bio); collect(a.qualite); }
  for (const o of m.oeuvres) { collect(o.comment); }
}
for (const l of LINKS) { collect(l.label); collect(l.note); }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function one(text: string): Promise<string> {
  const msgs = JSON.stringify([
    { role: 'system', content: 'Traducteur FR→EN spécialisé en littérature française. Réponds UNIQUEMENT par un JSON {"en":"..."} : traduction anglaise naturelle, noms propres et titres d’œuvres conservés, pas de guillemets « ».' },
    { role: 'user', content: text },
  ]);
  const out = await new Promise<string>((res, rej) => {
    const p = execFile('mmx', ['text', 'chat', '--messages-file', '-', '--output', 'json', '--max-tokens', '4000', '--temperature', '0.2', '--non-interactive'], { timeout: 120_000, maxBuffer: 4 * 1024 * 1024 }, (e, s) => (e ? rej(e) : res(s)));
    p.stdin?.end(msgs);
  });
  const d = JSON.parse(out);
  if (d.error) throw new Error(d.error.message);
  const t: string = d?.content?.[0]?.text ?? '';
  const j = JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1));
  return j.en;
}

async function main() {
  console.log(`${missing.length} textes à rattraper`);
  let ok = 0;
  let fail = 0;
  for (const t of missing) {
    for (let attempt = 0; attempt < 6; attempt++) {
      try {
        const en = await one(t);
        if (en) { cache[h(t)] = { text: t, en }; ok++; break; }
        throw new Error('vide');
      } catch (e) {
        const msg = e instanceof Error ? e.message : '';
        if (/rate limit|quota/i.test(msg)) await sleep(15_000 + attempt * 10_000);
        else await sleep(1_000);
        if (attempt === 5) fail++;
      }
    }
    if (ok % 10 === 9) writeFileSync(CACHE, JSON.stringify(cache));
    await sleep(300);
  }
  writeFileSync(CACHE, JSON.stringify(cache));
  console.log(`ok ${ok}, échec ${fail} — relancer i18n-generate pour réémettre en-data.ts`);
}

main();
