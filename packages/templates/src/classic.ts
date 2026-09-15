import type { CV } from '@ats-cv/schema';
import { e, formatDateRange, list, showIf } from './format.js';

const renderHeader = (cv: CV) => {
  const { personal } = cv;
  const contactBits: string[] = [];
  if (personal.city || personal.country) {
    contactBits.push(e([personal.city, personal.country].filter(Boolean).join(', ')));
  }
  if (personal.phone) contactBits.push(e(personal.phone));
  if (personal.email) contactBits.push(`<a href="mailto:${e(personal.email)}">${e(personal.email)}</a>`);
  for (const link of personal.links) {
    contactBits.push(`<a href="${e(link.url)}">${e(link.label || link.url)}</a>`);
  }
  return `
    <header class="c-header">
      <div class="c-thin-line"></div>
      <h1 class="c-name">${e(personal.fullName || 'Your Name')}</h1>
      ${showIf(personal.headline, `<div class="c-headline">${e(personal.headline)}</div>`)}
      <div class="c-thin-line"></div>
      <div class="c-thick-line"></div>
      ${contactBits.length ? `<div class="c-contact">${contactBits.join(' &nbsp;&#9670;&nbsp; ')}</div>` : ''}
    </header>`;
};

const sectionTitle = (label: string) => `<h2 class="c-section-title"><span>${e(label)}</span></h2>`;

const renderProfile = (cv: CV) =>
  showIf(cv.profile, `<section class="c-section">${sectionTitle('Profile')}<p class="c-profile">${e(cv.profile)}</p></section>`);

const renderEducation = (cv: CV) =>
  showIf(
    cv.education.length,
    `<section class="c-section">${sectionTitle('Education')}<div class="c-grid-2">${list(cv.education, (it) => `
      <div class="c-edu">
        <div class="c-degree">${e(it.degree)}</div>
        <div class="c-institution">${e(it.institution)}</div>
        <div class="c-meta">${formatDateRange(it.start, it.end)}${it.details ? ` &middot; ${e(it.details)}` : ''}</div>
      </div>
    `)}</div></section>`,
  );

const renderSkills = (cv: CV) => {
  if (!cv.skills.length) return '';
  const half = Math.ceil(cv.skills.length / 2);
  const left = cv.skills.slice(0, half);
  const right = cv.skills.slice(half);
  return `<section class="c-section">${sectionTitle('Skills')}<div class="c-grid-2">
    <ul>${list(left, (s) => `<li>${e(s)}</li>`)}</ul>
    <ul>${list(right, (s) => `<li>${e(s)}</li>`)}</ul>
  </div></section>`;
};

const renderExperience = (cv: CV) =>
  showIf(
    cv.experience.length,
    `<section class="c-section">${sectionTitle('Experience')}${list(cv.experience, (it) => `
      <article class="c-exp">
        <div class="c-job-row"><span class="c-job-title">${e(it.jobTitle)}</span><span class="c-meta">${formatDateRange(it.start, it.end)}</span></div>
        <div class="c-company">${e(it.company)}${it.location ? ` &middot; ${e(it.location)}` : ''}</div>
        ${it.bullets.length ? `<ul>${list(it.bullets, (b) => `<li>${e(b)}</li>`)}</ul>` : ''}
      </article>
    `)}</section>`,
  );

const renderTechnologies = (cv: CV) =>
  showIf(
    cv.meta.profileType === 'tech' && cv.technologies.length,
    `<section class="c-section">${sectionTitle('Technologies')}<ul class="c-tech-list">${list(cv.technologies, (g) => `
      <li><strong>${e(g.category)}:</strong> ${e(g.items.join(', '))}</li>
    `)}</ul></section>`,
  );

const renderLanguages = (cv: CV) =>
  showIf(
    cv.meta.profileType === 'non-tech' && cv.languages.length,
    `<section class="c-section">${sectionTitle('Languages')}<ul class="c-inline">${list(cv.languages, (l) => `<li>${e(l.name)} - ${e(l.level)}</li>`)}</ul></section>`,
  );

const renderAbilities = (cv: CV) =>
  showIf(
    cv.meta.profileType === 'non-tech' && cv.abilities.length,
    `<section class="c-section">${sectionTitle('Abilities')}<ul class="c-grid-2-list">${list(cv.abilities, (a) => `<li>${e(a)}</li>`)}</ul></section>`,
  );

const renderReferences = (cv: CV) =>
  showIf(
    cv.references.length,
    `<section class="c-section">${sectionTitle('References')}${list(cv.references, (r) => `
      <div class="c-ref"><strong>${e(r.name)}</strong>${r.role ? ` &mdash; ${e(r.role)}` : ''}${r.contact ? `<div class="c-meta">${e(r.contact)}</div>` : ''}</div>
    `)}</section>`,
  );

export const classicTemplate = (cv: CV) => `
  <div class="c-inner">
    ${renderHeader(cv)}
    ${renderEducation(cv)}
    ${renderProfile(cv)}
    ${renderSkills(cv)}
    ${renderExperience(cv)}
    ${renderTechnologies(cv)}
    ${renderLanguages(cv)}
    ${renderAbilities(cv)}
    ${renderReferences(cv)}
  </div>
`;

classicTemplate.css = `
  .tpl-classic .c-inner { padding: 4mm 6mm; }
  .tpl-classic .c-header { text-align: center; margin-bottom: 6px; }
  .tpl-classic .c-thin-line { height: 1px; background: #bbb; margin: 4px 0; }
  .tpl-classic .c-thick-line { height: 3px; background: #333; margin-top: 4px; }
  .tpl-classic .c-name { font-size: 24px; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; }
  .tpl-classic .c-headline { font-size: 11px; text-transform: uppercase; letter-spacing: 0.4px; color: #444; margin-top: 4px; }
  .tpl-classic .c-contact { font-size: 10px; color: #555; margin-top: 6px; }
  .tpl-classic .c-section { margin-top: 10px; }
  .tpl-classic .c-section-title { font-size: 14px; font-weight: 400; text-transform: uppercase; letter-spacing: 0.6px; text-align: center; display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
  .tpl-classic .c-section-title::before, .tpl-classic .c-section-title::after { content: ''; flex: 1; height: 1px; background: #bbb; }
  .tpl-classic .c-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .tpl-classic .c-grid-2-list { columns: 2; column-gap: 24px; padding-left: 18px; }
  .tpl-classic .c-degree { font-weight: 600; font-size: 12px; }
  .tpl-classic .c-institution { font-style: italic; color: var(--cv-muted); font-size: 11px; }
  .tpl-classic .c-meta { color: var(--cv-muted); font-size: 10px; }
  .tpl-classic .c-job-row { display: flex; justify-content: space-between; align-items: baseline; }
  .tpl-classic .c-job-title { font-weight: 700; }
  .tpl-classic .c-company { font-style: italic; color: var(--cv-muted); margin-bottom: 3px; }
  .tpl-classic .c-exp { margin-bottom: 8px; }
  .tpl-classic .c-exp ul li { font-size: 11px; margin-bottom: 2px; }
  .tpl-classic .c-tech-list li { font-size: 11px; margin-bottom: 2px; }
  .tpl-classic .c-inline { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 14px; }
  .tpl-classic .c-profile { text-align: justify; font-size: 11.5px; line-height: 1.55; }
  .tpl-classic .c-ref { margin-bottom: 4px; font-size: 11px; }
`;
