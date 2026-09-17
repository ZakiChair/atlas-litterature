import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { UI, type UiKey } from './ui';

export type Lang = 'fr' | 'en';

const LANG_KEY = 'atlas-lit.lang';

function detect(): Lang {
  if (typeof window === 'undefined') return 'fr';
  const q = new URLSearchParams(window.location.search).get('lang');
  if (q === 'en' || q === 'fr') return q;
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'en' || saved === 'fr') return saved;
  } catch {
    /* ignore */
  }
  return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'fr';
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: UiKey, vars?: Record<string, string | number>) => string;
}

const Ctx = createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(detect);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = UI[lang]['app.title'];
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', UI[lang]['app.description']);
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* ignore */
    }
    const url = new URL(window.location.href);
    if (url.searchParams.get('lang') !== lang) {
      url.searchParams.set('lang', lang);
      history.replaceState(null, '', url);
    }
  }, [lang]);

  const value = useMemo<LangCtx>(
    () => ({
      lang,
      setLang,
      t: (key, vars) => interpolate(UI[lang][key] ?? UI.fr[key] ?? key, vars),
    }),
    [lang],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLang hors de LangProvider');
  return ctx;
}
