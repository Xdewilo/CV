import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CvStateService } from './core/services/cv-state.service';
import { PdfService } from './core/services/pdf.service';
import { BuilderComponent } from './features/builder/builder.component';
import { PreviewComponent } from './features/preview/preview.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BuilderComponent, PreviewComponent],
  template: `
    <header class="border-b border-ink-300/70 bg-white">
      <div class="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-md bg-accent-600 text-white grid place-items-center font-bold">A</div>
          <div>
            <h1 class="text-base font-semibold leading-tight">ATS CV Builder</h1>
            <p class="text-xs text-ink-500">Open-source resume builder · ATS-friendly</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button class="btn-ghost" (click)="exportJson()">Exportar JSON</button>
          <label class="btn-ghost cursor-pointer">
            Importar JSON
            <input type="file" accept="application/json" class="hidden" (change)="onImport($event)" />
          </label>
          <button class="btn-ghost" (click)="loadDemo()">Cargar demo</button>
          <button class="btn-ghost" (click)="reset()">Reiniciar</button>
          <button class="btn-primary" (click)="downloadPdf()" [disabled]="downloading()">
            {{ downloading() ? 'Generando...' : 'Descargar PDF' }}
          </button>
        </div>
      </div>
      @if (toast()) {
        <div class="bg-amber-50 border-t border-amber-200 text-amber-900 text-sm px-4 py-2 text-center">
          {{ toast() }}
        </div>
      }
    </header>

    <main class="max-w-screen-2xl mx-auto px-4 py-6 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6">
      <section class="min-w-0">
        <app-builder />
      </section>
      <section class="min-w-0">
        <app-preview />
      </section>
    </main>
  `,
})
export class AppComponent {
  private readonly state = inject(CvStateService);
  private readonly pdf = inject(PdfService);
  private readonly http = inject(HttpClient);

  readonly downloading = signal(false);
  readonly toast = signal<string | null>(null);

  async downloadPdf(): Promise<void> {
    this.downloading.set(true);
    try {
      await this.pdf.download(this.state.cv());
    } catch (err) {
      this.flash(`Error al generar PDF: ${err instanceof Error ? err.message : err}`);
    } finally {
      this.downloading.set(false);
    }
  }

  exportJson(): void {
    const blob = new Blob([this.state.exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safe = (this.state.cv().personal.fullName || 'cv').replace(/[^\w\-]+/g, '_');
    a.href = url;
    a.download = `${safe}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  onImport(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? '');
      const result = this.state.importJson(text);
      if (!result.ok) this.flash(`Importación falló: ${result.error}`);
      else this.flash('JSON importado.');
      input.value = '';
    };
    reader.readAsText(file);
  }

  reset(): void {
    if (!confirm('Borrar todos los datos del CV?')) return;
    this.state.reset();
    this.flash('CV reiniciado.');
  }

  async loadDemo(): Promise<void> {
    if (!confirm('Cargar datos de ejemplo (Jeremy Posada)? Sobrescribirá tu CV actual.')) return;
    try {
      const data = await firstValueFrom(this.http.get('/assets/seed-jeremy.json'));
      const result = this.state.importJson(JSON.stringify(data));
      this.flash(result.ok ? 'Demo cargado.' : `No se pudo cargar: ${result.error}`);
    } catch (err) {
      this.flash(`Error cargando demo: ${err instanceof Error ? err.message : err}`);
    }
  }

  private flash(message: string): void {
    this.toast.set(message);
    setTimeout(() => this.toast.set(null), 3000);
  }
}
