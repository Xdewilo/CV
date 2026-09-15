import { FONT_OPTIONS } from '@ats-cv/schema';

export const fontStack = (id: string): string =>
  FONT_OPTIONS.find((f) => f.id === id)?.stack ?? "'Inter', system-ui, sans-serif";

const GOOGLE_FAMILIES: Record<string, string> = {
  inter: 'Inter:wght@400;500;600;700',
  roboto: 'Roboto:wght@400;500;700',
  lato: 'Lato:wght@400;700',
  'source-sans': 'Source+Sans+3:wght@400;600;700',
  merriweather: 'Merriweather:wght@400;700',
  'source-serif': 'Source+Serif+4:wght@400;600;700',
};

export const googleFontHref = (id: string): string | null => {
  const family = GOOGLE_FAMILIES[id];
  return family ? `https://fonts.googleapis.com/css2?family=${family}&display=swap` : null;
};
