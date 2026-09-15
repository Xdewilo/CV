import { escapeHtml } from './escape.js';

export const formatDateRange = (
  start?: string,
  end?: string,
  locale: 'es' | 'en' = 'en',
): string => {
  const fmt = (raw?: string) => {
    if (!raw) return '';
    if (raw === 'current') return locale === 'es' ? 'Actual' : 'Present';
    const [y, m] = raw.split('-');
    if (!y || !m) return raw;
    return `${m}/${y}`;
  };
  const s = fmt(start);
  const e = fmt(end);
  if (!s && !e) return '';
  if (!s) return e;
  if (!e) return s;
  return `${s} - ${e}`;
};

export const e = escapeHtml;

export const list = <T>(arr: T[] | undefined, render: (item: T, i: number) => string) =>
  (arr ?? []).map(render).join('');

export const showIf = (cond: unknown, html: string) => (cond ? html : '');
