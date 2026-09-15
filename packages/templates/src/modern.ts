import type { CV } from '@ats-cv/schema';
import { e, formatDateRange, list, showIf } from './format.js';

const sectionTitle = (label: string) => `<h2 class="m-section-title">${e(label)}</h2>`;

const renderHeader = (cv: CV) => {
  const { personal } = cv;
  const contact: string[] = [];
  if (personal.phone) contact.push(`<span>${e(personal.phone)}</span>`);
  if (personal.email) contact.push(`<a href="mailto:${e(personal.email)}">${e(personal.email)}</a>`);
  if (personal.city || personal.country) {
    contact.push(`<span>${e([personal.city, personal.country].filter(Boolean).join(', '))}</span>`);
  }
  for (const link of personal.links) {
    contact.push(`<a href="${e(link.url)}">${e(link.label || link.url)}</a>`);
  }
  return `
    <header class="m-header">
      <div class="m-header-main">
        <h1 class="m-name">${e(personal.fullName || 'Your Name')}</h1>
        ${showIf(personal.headline, `<div class="m-headline">${e(personal.headline)}</div>`)}
      </div>
      ${contact.length ? `<div class="m-contact">${contact.join('<span class="m-dot">&middot;</span>')}</div>` : ''}
    </header>
    <div class="m-accent-bar"></div>
  `;
};

const renderProfile = (cv: CV) =>
  showIf(cv.profile, `<section class="m-section">${sectionTitle('Profile')}<p class="m-profile">${e(cv.profile)}</p></section>`);

const renderExperience = (cv: CV) =>
  showIf(
    cv.experience.length,
    `<section class="m-section">${sectionTitle('Experience')}${list(cv.experience, (it) => `
      <article class="m-exp">
        <div class="m-exp-head">
          <div>
            <div class="m-job-title">${e(it.jobTitle)}</div>
            <div class="m-company">${e(it.company)}${it.location ? ` &middot; ${e(it.location)}` : ''}</div>
          </div>
          <div class="m-meta">${formatDateRange(it.start, it.end)}</div>
        </div>
        ${it.bullets.length ? `<ul>${list(it.bullets, (b) => `<li>${e(b)}</li>`)}</ul>` : ''}
      </article>
    `)}</section>`,
  );

const renderEducation = (cv: CV) =>
  showIf(
    cv.education.length,
    `<section class="m-section">${sectionTitle('Education')}${list(cv.education, (it) => `
      <div class="m-edu">
        <div class="m-edu-row">
          <div>
            <div class="m-degree">${e(it.degree)}</div>
            <div class="m-institution">${e(it.institution)}</div>
          </div>
          <div class="m-meta">${formatDateRange(it.start, it.end)}</div>
        </div>
        ${it.details ? `<div class="m-meta">${e(it.details)}</div>` : ''}
      </div>
    `)}</section>`,
  );

const renderSkills = (cv: CV) =>
  showIf(
    cv.skills.length,
    `<section class="m-section">${sectionTitle('Skills')}<div class="m-chips">${list(cv.skills, (s) => `<span class="m-chip">${e(s)}</span>`)}</div></section>`,
  );

const renderTechnologies = (cv: CV) =>
  showIf(
    cv.meta.profileType === 'tech' && cv.technologies.length,
    `<section class="m-section">${sectionTitle('Technologies')}<div class="m-tech-grid">${list(cv.technologies, (g) => `
      <div class="m-tech-group"><div class="m-tech-cat">${e(g.category)}</div><div class="m-tech-items">${e(g.items.join(', '))}</div></div>
    `)}</div></section>`,
  );

const renderLanguages = (cv: CV) =>
  showIf(
    cv.meta.profileType === 'non-tech' && cv.languages.length,
    `<section class="m-section">${sectionTitle('Languages')}<div class="m-chips">${list(cv.languages, (l) => `<span class="m-chip">${e(l.name)} - ${e(l.level)}</span>`)}</div></section>`,
  );

const renderAbilities = (cv: CV) =>
  showIf(
    cv.meta.profileType === 'non-tech' && cv.abilities.length,
    `<section class="m-section">${sectionTitle('Abilities')}<div class="m-chips">${list(cv.abilities, (a) => `<span class="m-chip">${e(a)}</span>`)}</div></section>`,
  );

const renderReferences = (cv: CV) =>
  showIf(
    cv.references.length,
    `<section class="m-section">${sectionTitle('References')}${list(cv.references, (r) => `
      <div class="m-ref"><strong>${e(r.name)}</strong>${r.role ? ` &mdash; ${e(r.role)}` : ''}${r.contact ? `<div class="m-meta">${e(r.contact)}</div>` : ''}</div>
    `)}</section>`,
  );

export const modernTemplate = (cv: CV) => `
  <div class="m-inner">
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

modernTemplate.css = `
  .tpl-modern .m-inner { padding: 6mm 8mm; }
  .tpl-modern .m-header { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; }
  .tpl-modern .m-name { font-size: 26px; font-weight: 700; color: var(--cv-text); letter-spacing: 0.2px; }
  .tpl-modern .m-headline { font-size: 12px; color: var(--cv-accent); margin-top: 4px; font-weight: 500; }
  .tpl-modern .m-contact { font-size: 10px; color: var(--cv-muted); display: flex; flex-wrap: wrap; gap: 4px; align-items: center; }
  .tpl-modern .m-dot { color: var(--cv-muted); }
  .tpl-modern .m-accent-bar { height: 3px; background: var(--cv-accent); margin: 8px 0 12px; }
  .tpl-modern .m-section { margin-bottom: 10px; }
  .tpl-modern .m-section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: var(--cv-accent); border-bottom: 1px solid #e5e7eb; padding-bottom: 3px; margin-bottom: 6px; }
  .tpl-modern .m-exp-head, .tpl-modern .m-edu-row { display: flex; justify-content: space-between; gap: 12px; align-items: baseline; }
  .tpl-modern .m-job-title { font-weight: 700; font-size: 12px; }
  .tpl-modern .m-company { font-size: 11px; color: var(--cv-muted); }
  .tpl-modern .m-degree { font-weight: 600; font-size: 12px; }
  .tpl-modern .m-institution { font-size: 11px; color: var(--cv-muted); }
  .tpl-modern .m-meta { font-size: 10px; color: var(--cv-muted); white-space: nowrap; }
  .tpl-modern .m-exp { margin-bottom: 7px; }
  .tpl-modern .m-exp ul li { font-size: 11px; margin-bottom: 2px; }
  .tpl-modern .m-edu { margin-bottom: 6px; }
  .tpl-modern .m-chips { display: flex; flex-wrap: wrap; gap: 5px; }
  .tpl-modern .m-chip { font-size: 10px; padding: 2px 8px; border: 1px solid #d1d5db; border-radius: 999px; background: #f9fafb; }
  .tpl-modern .m-tech-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 16px; font-size: 11px; }
  .tpl-modern .m-tech-cat { font-weight: 600; color: var(--cv-accent); font-size: 10px; }
  .tpl-modern .m-tech-items { font-size: 11px; }
  .tpl-modern .m-profile { font-size: 11.5px; line-height: 1.55; text-align: justify; }
  .tpl-modern .m-ref { font-size: 11px; margin-bottom: 4px; }
`;
