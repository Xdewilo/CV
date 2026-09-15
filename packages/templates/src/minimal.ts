import type { CV } from '@ats-cv/schema';
import { e, formatDateRange, list, showIf } from './format.js';

const sectionTitle = (label: string) => `<h2 class="x-section-title">${e(label)}</h2>`;

const renderHeader = (cv: CV) => {
  const { personal } = cv;
  const contact: string[] = [];
  if (personal.city || personal.country) contact.push(e([personal.city, personal.country].filter(Boolean).join(', ')));
  if (personal.phone) contact.push(e(personal.phone));
  if (personal.email) contact.push(`<a href="mailto:${e(personal.email)}">${e(personal.email)}</a>`);
  for (const link of personal.links) {
    contact.push(`<a href="${e(link.url)}">${e(link.label || link.url)}</a>`);
  }
  return `
    <header class="x-header">
      <h1 class="x-name">${e(personal.fullName || 'Your Name')}</h1>
      ${showIf(personal.headline, `<div class="x-headline">${e(personal.headline)}</div>`)}
      ${contact.length ? `<div class="x-contact">${contact.join(' &middot; ')}</div>` : ''}
    </header>
  `;
};

const renderProfile = (cv: CV) =>
  showIf(cv.profile, `<section class="x-section">${sectionTitle('Profile')}<p class="x-profile">${e(cv.profile)}</p></section>`);

const renderExperience = (cv: CV) =>
  showIf(
    cv.experience.length,
    `<section class="x-section">${sectionTitle('Experience')}${list(cv.experience, (it) => `
      <article class="x-exp">
        <div class="x-row"><span class="x-bold">${e(it.jobTitle)}</span><span class="x-meta">${formatDateRange(it.start, it.end)}</span></div>
        <div class="x-meta">${e(it.company)}${it.location ? ` &middot; ${e(it.location)}` : ''}</div>
        ${it.bullets.length ? `<ul>${list(it.bullets, (b) => `<li>${e(b)}</li>`)}</ul>` : ''}
      </article>
    `)}</section>`,
  );

const renderEducation = (cv: CV) =>
  showIf(
    cv.education.length,
    `<section class="x-section">${sectionTitle('Education')}${list(cv.education, (it) => `
      <div class="x-edu">
        <div class="x-row"><span class="x-bold">${e(it.degree)}</span><span class="x-meta">${formatDateRange(it.start, it.end)}</span></div>
        <div class="x-meta">${e(it.institution)}${it.details ? ` &middot; ${e(it.details)}` : ''}</div>
      </div>
    `)}</section>`,
  );

const renderSkills = (cv: CV) =>
  showIf(
    cv.skills.length,
    `<section class="x-section">${sectionTitle('Skills')}<ul class="x-flow">${list(cv.skills, (s) => `<li>${e(s)}</li>`)}</ul></section>`,
  );

const renderTechnologies = (cv: CV) =>
  showIf(
    cv.meta.profileType === 'tech' && cv.technologies.length,
    `<section class="x-section">${sectionTitle('Technologies')}<ul class="x-stack">${list(cv.technologies, (g) => `<li><span class="x-bold">${e(g.category)}:</span> ${e(g.items.join(', '))}</li>`)}</ul></section>`,
  );

const renderLanguages = (cv: CV) =>
  showIf(
    cv.meta.profileType === 'non-tech' && cv.languages.length,
    `<section class="x-section">${sectionTitle('Languages')}<ul class="x-flow">${list(cv.languages, (l) => `<li>${e(l.name)} - ${e(l.level)}</li>`)}</ul></section>`,
  );

const renderAbilities = (cv: CV) =>
  showIf(
    cv.meta.profileType === 'non-tech' && cv.abilities.length,
    `<section class="x-section">${sectionTitle('Abilities')}<ul class="x-flow">${list(cv.abilities, (a) => `<li>${e(a)}</li>`)}</ul></section>`,
  );

const renderReferences = (cv: CV) =>
  showIf(
    cv.references.length,
    `<section class="x-section">${sectionTitle('References')}${list(cv.references, (r) => `
      <div class="x-ref"><span class="x-bold">${e(r.name)}</span>${r.role ? ` &mdash; ${e(r.role)}` : ''}${r.contact ? `<div class="x-meta">${e(r.contact)}</div>` : ''}</div>
    `)}</section>`,
  );

export const minimalTemplate = (cv: CV) => `
  <div class="x-inner">
    ${renderHeader(cv)}
    ${renderProfile(cv)}
    ${renderExperience(cv)}
    ${renderEducation(cv)}
    ${renderSkills(cv)}
    ${renderTechnologies(cv)}
    ${renderLanguages(cv)}
    ${renderAbilities(cv)}
    ${renderReferences(cv)}
  </div>
`;

minimalTemplate.css = `
  .tpl-minimal .x-inner { padding: 12mm 14mm; }
  .tpl-minimal .x-header { margin-bottom: 14px; }
  .tpl-minimal .x-name { font-size: 28px; font-weight: 600; letter-spacing: -0.4px; }
  .tpl-minimal .x-headline { font-size: 13px; color: var(--cv-muted); margin-top: 4px; }
  .tpl-minimal .x-contact { font-size: 10.5px; color: var(--cv-muted); margin-top: 8px; }
  .tpl-minimal .x-section { margin-bottom: 14px; }
  .tpl-minimal .x-section-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.2px; color: var(--cv-muted); margin-bottom: 6px; }
  .tpl-minimal .x-row { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
  .tpl-minimal .x-bold { font-weight: 600; font-size: 12px; }
  .tpl-minimal .x-meta { color: var(--cv-muted); font-size: 10.5px; }
  .tpl-minimal .x-exp { margin-bottom: 8px; }
  .tpl-minimal .x-exp ul li, .tpl-minimal .x-edu, .tpl-minimal .x-ref { font-size: 11px; margin-bottom: 2px; }
  .tpl-minimal .x-edu { margin-bottom: 8px; }
  .tpl-minimal .x-flow { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 11px; }
  .tpl-minimal .x-stack { list-style: none; padding: 0; }
  .tpl-minimal .x-stack li { font-size: 11px; margin-bottom: 2px; }
  .tpl-minimal .x-profile { font-size: 11.5px; line-height: 1.6; }
`;
