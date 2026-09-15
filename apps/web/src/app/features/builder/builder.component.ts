import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CvStateService } from '../../core/services/cv-state.service';
import { ChipListComponent } from '../../shared/chip-list.component';
import type { CV, EducationItem, ExperienceItem, LanguageItem, ReferenceItem, TechGroup } from '@ats-cv/schema';

type SectionId =
  | 'personal'
  | 'profile'
  | 'skills'
  | 'experience'
  | 'education'
  | 'extras'
  | 'references';

interface SectionDef {
  id: SectionId;
  label: string;
}

@Component({
  selector: 'app-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, ChipListComponent],
  template: `
    <div class="card">
      <div class="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div class="flex flex-wrap gap-1">
          @for (s of sections(); track s.id) {
            <button class="tab" [class.active]="active() === s.id" (click)="setActive(s.id)">
              {{ s.label }}
            </button>
          }
        </div>
        <div class="flex items-center gap-2 text-xs">
          <span class="text-ink-500">Tipo de perfil:</span>
          <button
            type="button"
            class="tab"
            [class.active]="cv().meta.profileType === 'tech'"
            (click)="setProfileType('tech')"
          >
            Tech
          </button>
          <button
            type="button"
            class="tab"
            [class.active]="cv().meta.profileType === 'non-tech'"
            (click)="setProfileType('non-tech')"
          >
            No-tech
          </button>
        </div>
      </div>

      @switch (active()) {
        @case ('personal') {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="field md:col-span-2">
              <label>Nombre completo</label>
              <input [ngModel]="cv().personal.fullName" (ngModelChange)="patchPersonal({ fullName: $event })" />
            </div>
            <div class="field md:col-span-2">
              <label>Headline / Cargo</label>
              <input [ngModel]="cv().personal.headline" (ngModelChange)="patchPersonal({ headline: $event })" placeholder="Software Engineer | Backend | Java Spring Boot" />
            </div>
            <div class="field"><label>Ciudad</label><input [ngModel]="cv().personal.city" (ngModelChange)="patchPersonal({ city: $event })" /></div>
            <div class="field"><label>País</label><input [ngModel]="cv().personal.country" (ngModelChange)="patchPersonal({ country: $event })" /></div>
            <div class="field"><label>Teléfono</label><input [ngModel]="cv().personal.phone" (ngModelChange)="patchPersonal({ phone: $event })" /></div>
            <div class="field"><label>Email</label><input type="email" [ngModel]="cv().personal.email" (ngModelChange)="patchPersonal({ email: $event })" /></div>
            <div class="md:col-span-2">
              <label class="text-xs font-semibold uppercase tracking-wide text-ink-500 block mb-2">Links</label>
              @for (link of cv().personal.links; track $index) {
                <div class="flex gap-2 mb-2">
                  <input class="rounded-md border border-ink-300 bg-white px-3 py-2 text-sm w-40" placeholder="LinkedIn" [ngModel]="link.label" (ngModelChange)="updateLink($index, { label: $event })" />
                  <input class="rounded-md border border-ink-300 bg-white px-3 py-2 text-sm flex-1" placeholder="https://..." [ngModel]="link.url" (ngModelChange)="updateLink($index, { url: $event })" />
                  <button type="button" class="btn-ghost" (click)="removeLink($index)">Quitar</button>
                </div>
              }
              <button type="button" class="btn-ghost" (click)="addLink()">+ Agregar link</button>
            </div>
          </div>
        }

        @case ('profile') {
          <div class="field">
            <label>Perfil / Sobre mí</label>
            <textarea rows="8" [ngModel]="cv().profile" (ngModelChange)="patch({ profile: $event })" placeholder="Resumen profesional 3-5 líneas. Áreas de enfoque, tecnologías clave, valor diferencial."></textarea>
            <div class="text-xs text-ink-500 mt-1">{{ (cv().profile || '').length }} caracteres</div>
          </div>
        }

        @case ('skills') {
          <div class="field">
            <label>Skills (una por línea)</label>
            <app-chip-list
              [items]="cv().skills"
              (itemsChange)="patch({ skills: $event })"
              placeholder="Ej: Arquitectura Hexagonal, DDD, CQRS"
              emptyMessage="Sin skills agregadas"
            />
          </div>
        }

        @case ('experience') {
          @for (exp of cv().experience; track $index) {
            <div class="card mb-3 bg-ink-100/40">
              <div class="flex items-center justify-between mb-2">
                <strong class="text-sm">Experiencia #{{ $index + 1 }}</strong>
                <div class="flex gap-1">
                  <button type="button" class="btn-ghost px-2 py-1" (click)="moveExperience($index, -1)" [disabled]="$index === 0">↑</button>
                  <button type="button" class="btn-ghost px-2 py-1" (click)="moveExperience($index, 1)" [disabled]="$index === cv().experience.length - 1">↓</button>
                  <button type="button" class="btn-danger px-2 py-1" (click)="removeExperience($index)">Eliminar</button>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="field md:col-span-2"><label>Cargo</label><input [ngModel]="exp.jobTitle" (ngModelChange)="updateExperience($index, { jobTitle: $event })" /></div>
                <div class="field"><label>Empresa</label><input [ngModel]="exp.company" (ngModelChange)="updateExperience($index, { company: $event })" /></div>
                <div class="field"><label>Ubicación</label><input [ngModel]="exp.location" (ngModelChange)="updateExperience($index, { location: $event })" /></div>
                <div class="field"><label>Inicio (YYYY-MM)</label><input [ngModel]="exp.start" (ngModelChange)="updateExperience($index, { start: $event })" placeholder="2023-03" /></div>
                <div class="field">
                  <label>Fin (YYYY-MM o "current")</label>
                  <input [ngModel]="exp.end" (ngModelChange)="updateExperience($index, { end: $event })" placeholder="2024-12 o current" />
                </div>
                <div class="md:col-span-2">
                  <label class="text-xs font-semibold uppercase tracking-wide text-ink-500 block mb-2">Logros / Bullets</label>
                  <app-chip-list
                    [items]="exp.bullets"
                    (itemsChange)="updateExperience($index, { bullets: $event })"
                    placeholder="Acción + impacto + métrica"
                    emptyMessage="Agrega bullets de impacto"
                  />
                </div>
              </div>
            </div>
          }
          <button type="button" class="btn-ghost" (click)="addExperience()">+ Agregar experiencia</button>
        }

        @case ('education') {
          @for (ed of cv().education; track $index) {
            <div class="card mb-3 bg-ink-100/40">
              <div class="flex items-center justify-between mb-2">
                <strong class="text-sm">Estudio #{{ $index + 1 }}</strong>
                <div class="flex gap-1">
                  <button type="button" class="btn-ghost px-2 py-1" (click)="moveEducation($index, -1)" [disabled]="$index === 0">↑</button>
                  <button type="button" class="btn-ghost px-2 py-1" (click)="moveEducation($index, 1)" [disabled]="$index === cv().education.length - 1">↓</button>
                  <button type="button" class="btn-danger px-2 py-1" (click)="removeEducation($index)">Eliminar</button>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="field md:col-span-2"><label>Título</label><input [ngModel]="ed.degree" (ngModelChange)="updateEducation($index, { degree: $event })" /></div>
                <div class="field md:col-span-2"><label>Institución</label><input [ngModel]="ed.institution" (ngModelChange)="updateEducation($index, { institution: $event })" /></div>
                <div class="field"><label>Inicio (YYYY-MM)</label><input [ngModel]="ed.start" (ngModelChange)="updateEducation($index, { start: $event })" /></div>
                <div class="field"><label>Fin (YYYY-MM)</label><input [ngModel]="ed.end" (ngModelChange)="updateEducation($index, { end: $event })" /></div>
                <div class="field md:col-span-2"><label>Detalles</label><input [ngModel]="ed.details" (ngModelChange)="updateEducation($index, { details: $event })" placeholder="Promedio, énfasis, mención" /></div>
              </div>
            </div>
          }
          <button type="button" class="btn-ghost" (click)="addEducation()">+ Agregar educación</button>
        }

        @case ('extras') {
          @if (cv().meta.profileType === 'tech') {
            <h3 class="text-sm font-semibold mb-2">Tecnologías (perfil Tech)</h3>
            @for (g of cv().technologies; track $index) {
              <div class="card mb-3 bg-ink-100/40">
                <div class="flex items-center justify-between mb-2">
                  <strong class="text-sm">Categoría #{{ $index + 1 }}</strong>
                  <button type="button" class="btn-danger px-2 py-1" (click)="removeTech($index)">Eliminar</button>
                </div>
                <div class="field mb-3"><label>Categoría</label><input [ngModel]="g.category" (ngModelChange)="updateTech($index, { category: $event })" placeholder="Backend, Frontend, Data, Infra..." /></div>
                <div class="field">
                  <label>Items</label>
                  <app-chip-list [items]="g.items" (itemsChange)="updateTech($index, { items: $event })" placeholder="Java, Spring Boot, Kafka" />
                </div>
              </div>
            }
            <button type="button" class="btn-ghost" (click)="addTech()">+ Agregar categoría</button>
          } @else {
            <h3 class="text-sm font-semibold mb-2">Idiomas</h3>
            @for (l of cv().languages; track $index) {
              <div class="flex gap-2 mb-2">
                <input class="rounded-md border border-ink-300 bg-white px-3 py-2 text-sm flex-1" placeholder="Inglés" [ngModel]="l.name" (ngModelChange)="updateLanguage($index, { name: $event })" />
                <input class="rounded-md border border-ink-300 bg-white px-3 py-2 text-sm flex-1" placeholder="B2 / Avanzado" [ngModel]="l.level" (ngModelChange)="updateLanguage($index, { level: $event })" />
                <button type="button" class="btn-danger" (click)="removeLanguage($index)">Quitar</button>
              </div>
            }
            <button type="button" class="btn-ghost mb-4" (click)="addLanguage()">+ Agregar idioma</button>

            <h3 class="text-sm font-semibold mt-6 mb-2">Habilidades blandas</h3>
            <app-chip-list [items]="cv().abilities" (itemsChange)="patch({ abilities: $event })" placeholder="Comunicación, liderazgo, resolución de conflictos" />
          }
        }

        @case ('references') {
          @for (r of cv().references; track $index) {
            <div class="card mb-3 bg-ink-100/40">
              <div class="flex items-center justify-between mb-2">
                <strong class="text-sm">Referencia #{{ $index + 1 }}</strong>
                <button type="button" class="btn-danger px-2 py-1" (click)="removeReference($index)">Eliminar</button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="field"><label>Nombre</label><input [ngModel]="r.name" (ngModelChange)="updateReference($index, { name: $event })" /></div>
                <div class="field"><label>Cargo / Rol</label><input [ngModel]="r.role" (ngModelChange)="updateReference($index, { role: $event })" /></div>
                <div class="field md:col-span-2"><label>Contacto</label><input [ngModel]="r.contact" (ngModelChange)="updateReference($index, { contact: $event })" placeholder="Email · Teléfono · Empresa" /></div>
              </div>
            </div>
          }
          <button type="button" class="btn-ghost" (click)="addReference()">+ Agregar referencia</button>
        }
      }
    </div>
  `,
})
export class BuilderComponent {
  private readonly state = inject(CvStateService);
  readonly cv = this.state.cv;

  readonly active = signal<SectionId>('personal');

  readonly sections = computed<SectionDef[]>(() => {
    const isTech = this.cv().meta.profileType === 'tech';
    return [
      { id: 'personal', label: 'Personal' },
      { id: 'profile', label: 'Perfil' },
      { id: 'skills', label: 'Skills' },
      { id: 'experience', label: 'Experiencia' },
      { id: 'education', label: 'Educación' },
      { id: 'extras', label: isTech ? 'Tecnologías' : 'Idiomas + Habilidades' },
      { id: 'references', label: 'Referencias' },
    ];
  });

  setActive(id: SectionId): void {
    this.active.set(id);
  }

  patch(partial: Partial<CV>): void {
    this.state.patch(partial);
  }
  patchPersonal(partial: Partial<CV['personal']>): void {
    this.state.patchPersonal(partial);
  }
  setProfileType(t: 'tech' | 'non-tech'): void {
    this.state.patchMeta({ profileType: t });
  }

  // Links
  addLink(): void {
    this.patchPersonal({ links: [...this.cv().personal.links, { label: '', url: '' }] });
  }
  updateLink(i: number, partial: Partial<CV['personal']['links'][number]>): void {
    const links = this.cv().personal.links.map((l, idx) => (idx === i ? { ...l, ...partial } : l));
    this.patchPersonal({ links });
  }
  removeLink(i: number): void {
    this.patchPersonal({ links: this.cv().personal.links.filter((_, idx) => idx !== i) });
  }

  // Experience
  addExperience(): void {
    const exp: ExperienceItem = { jobTitle: '', company: '', location: '', start: '', end: '', bullets: [] };
    this.state.setSection('experience', [...this.cv().experience, exp]);
  }
  updateExperience(i: number, partial: Partial<ExperienceItem>): void {
    this.state.setSection(
      'experience',
      this.cv().experience.map((e, idx) => (idx === i ? { ...e, ...partial } : e)),
    );
  }
  removeExperience(i: number): void {
    this.state.setSection('experience', this.cv().experience.filter((_, idx) => idx !== i));
  }
  moveExperience(i: number, dir: -1 | 1): void {
    this.state.setSection('experience', moveItem(this.cv().experience, i, dir));
  }

  // Education
  addEducation(): void {
    const ed: EducationItem = { degree: '', institution: '', details: '', start: '', end: '' };
    this.state.setSection('education', [...this.cv().education, ed]);
  }
  updateEducation(i: number, partial: Partial<EducationItem>): void {
    this.state.setSection(
      'education',
      this.cv().education.map((e, idx) => (idx === i ? { ...e, ...partial } : e)),
    );
  }
  removeEducation(i: number): void {
    this.state.setSection('education', this.cv().education.filter((_, idx) => idx !== i));
  }
  moveEducation(i: number, dir: -1 | 1): void {
    this.state.setSection('education', moveItem(this.cv().education, i, dir));
  }

  // Tech
  addTech(): void {
    const t: TechGroup = { category: '', items: [] };
    this.state.setSection('technologies', [...this.cv().technologies, t]);
  }
  updateTech(i: number, partial: Partial<TechGroup>): void {
    this.state.setSection(
      'technologies',
      this.cv().technologies.map((t, idx) => (idx === i ? { ...t, ...partial } : t)),
    );
  }
  removeTech(i: number): void {
    this.state.setSection('technologies', this.cv().technologies.filter((_, idx) => idx !== i));
  }

  // Languages
  addLanguage(): void {
    const l: LanguageItem = { name: '', level: '' };
    this.state.setSection('languages', [...this.cv().languages, l]);
  }
  updateLanguage(i: number, partial: Partial<LanguageItem>): void {
    this.state.setSection(
      'languages',
      this.cv().languages.map((l, idx) => (idx === i ? { ...l, ...partial } : l)),
    );
  }
  removeLanguage(i: number): void {
    this.state.setSection('languages', this.cv().languages.filter((_, idx) => idx !== i));
  }

  // References
  addReference(): void {
    const r: ReferenceItem = { name: '', role: '', contact: '' };
    this.state.setSection('references', [...this.cv().references, r]);
  }
  updateReference(i: number, partial: Partial<ReferenceItem>): void {
    this.state.setSection(
      'references',
      this.cv().references.map((r, idx) => (idx === i ? { ...r, ...partial } : r)),
    );
  }
  removeReference(i: number): void {
    this.state.setSection('references', this.cv().references.filter((_, idx) => idx !== i));
  }
}

const moveItem = <T>(arr: T[], index: number, dir: -1 | 1): T[] => {
  const next = [...arr];
  const target = index + dir;
  if (target < 0 || target >= next.length) return arr;
  [next[index], next[target]] = [next[target]!, next[index]!];
  return next;
};
