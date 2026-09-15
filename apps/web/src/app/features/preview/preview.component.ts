import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { CvStateService } from '../../core/services/cv-state.service';
import { renderBody, baseCss, allTemplateCss } from '@ats-cv/templates';
import { FONT_OPTIONS, TEMPLATE_IDS, type TemplateId } from '@ats-cv/schema';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card sticky top-4">
      <div class="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div class="flex gap-1">
          @for (t of templates; track t) {
            <button class="tab" [class.active]="meta().templateId === t" (click)="setTemplate(t)">{{ t }}</button>
          }
        </div>
        <div class="flex items-center gap-2">
          <select class="rounded-md border border-ink-300 bg-white px-2 py-1 text-xs" [value]="meta().fontId" (change)="setFont($event)">
            @for (f of fonts; track f.id) {
              <option [value]="f.id">{{ f.label }}</option>
            }
          </select>
          <input type="color" class="h-8 w-10 cursor-pointer rounded border border-ink-300" [value]="meta().accentColor" (change)="setAccent($event)" />
          <div class="flex items-center gap-1 text-xs text-ink-500">
            <button class="btn-ghost px-2 py-1" (click)="zoomOut()">-</button>
            <span class="w-10 text-center">{{ (zoom() * 100).toFixed(0) }}%</span>
            <button class="btn-ghost px-2 py-1" (click)="zoomIn()">+</button>
          </div>
        </div>
      </div>

      <div class="overflow-auto bg-ink-100 rounded-md p-4">
        <div class="preview-frame" [style.transform]="'scale(' + zoom() + ')'">
          <style [innerHTML]="css()"></style>
          <div class="cv-page" [class]="'tpl-' + meta().templateId" [innerHTML]="body()"></div>
        </div>
      </div>
    </div>
  `,
})
export class PreviewComponent {
  private readonly state = inject(CvStateService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly templates = TEMPLATE_IDS;
  readonly fonts = FONT_OPTIONS;
  readonly zoom = signal(0.7);

  readonly meta = computed(() => this.state.cv().meta);

  readonly body = computed(() => this.sanitizer.bypassSecurityTrustHtml(renderBody(this.state.cv())));

  readonly css = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(`${baseCss(this.state.cv())}\n${allTemplateCss()}`),
  );

  setTemplate(t: TemplateId): void {
    this.state.patchMeta({ templateId: t });
  }
  setFont(ev: Event): void {
    this.state.patchMeta({ fontId: (ev.target as HTMLSelectElement).value });
  }
  setAccent(ev: Event): void {
    this.state.patchMeta({ accentColor: (ev.target as HTMLInputElement).value });
  }
  zoomIn(): void {
    this.zoom.update((v) => Math.min(1.2, +(v + 0.1).toFixed(2)));
  }
  zoomOut(): void {
    this.zoom.update((v) => Math.max(0.4, +(v - 0.1).toFixed(2)));
  }
}
