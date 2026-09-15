import type { CV } from '@ats-cv/schema';
import { classicTemplate } from './classic.js';
import { modernTemplate } from './modern.js';
import { minimalTemplate } from './minimal.js';
import { fontStack, googleFontHref } from './fonts.js';
import { escapeHtml } from './escape.js';

export { escapeHtml };

export const renderBody = (cv: CV): string => {
  switch (cv.meta.templateId) {
    case 'modern':
      return modernTemplate(cv);
    case 'minimal':
      return minimalTemplate(cv);
    case 'classic':
    default:
      return classicTemplate(cv);
  }
};

export const allTemplateCss = (): string =>
  [classicTemplate.css, modernTemplate.css, minimalTemplate.css].join('\n');

export const baseCss = (cv: CV): string => `
  @page { size: A4; margin: 8mm 12mm; }
  :root {
    --cv-font: ${fontStack(cv.meta.fontId)};
    --cv-accent: ${cv.meta.accentColor};
    --cv-text: #111827;
    --cv-muted: #6b7280;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { font-family: var(--cv-font); color: var(--cv-text); background: white; }
  body { font-size: 11px; line-height: 1.4; }
  a { color: inherit; text-decoration: none; }
  ul { list-style: disc; padding-left: 18px; }
  .cv-page { width: 210mm; min-height: 297mm; padding: 0; margin: 0 auto; background: white; }
`;

export const renderHtml = (cv: CV): string => {
  const fontHref = googleFontHref(cv.meta.fontId);
  const fontLink = fontHref
    ? `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="${fontHref}" rel="stylesheet">`
    : '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(cv.personal.fullName || 'CV')}</title>
  ${fontLink}
  <style>
    ${baseCss(cv)}
    ${allTemplateCss()}
  </style>
</head>
<body>
  <div class="cv-page tpl-${cv.meta.templateId}">${renderBody(cv)}</div>
</body>
</html>`;
};
