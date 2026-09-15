import { Injectable, computed, effect, signal } from '@angular/core';
import { type CV, cvSchema, emptyCV } from '@ats-cv/schema';
import { StorageService, DRAFT_KEY } from './storage.service';

@Injectable({ providedIn: 'root' })
export class CvStateService {
  private readonly storage = new StorageService();

  readonly cv = signal<CV>(this.loadInitial());

  readonly meta = computed(() => this.cv().meta);
  readonly profileType = computed(() => this.cv().meta.profileType);

  constructor() {
    effect(() => {
      const value = this.cv();
      this.storage.saveDebounced(DRAFT_KEY, value);
    });
  }

  private loadInitial(): CV {
    const raw = this.storage.read<CV>(DRAFT_KEY);
    if (!raw) return emptyCV();
    const parsed = cvSchema.safeParse(raw);
    return parsed.success ? parsed.data : emptyCV();
  }

  patch(partial: Partial<CV>): void {
    this.cv.update((current) => ({ ...current, ...partial }));
  }

  patchPersonal(partial: Partial<CV['personal']>): void {
    this.cv.update((current) => ({
      ...current,
      personal: { ...current.personal, ...partial },
    }));
  }

  patchMeta(partial: Partial<CV['meta']>): void {
    this.cv.update((current) => ({
      ...current,
      meta: { ...current.meta, ...partial },
    }));
  }

  setSection<K extends keyof CV>(key: K, value: CV[K]): void {
    this.cv.update((current) => ({ ...current, [key]: value }));
  }

  reset(): void {
    this.cv.set(emptyCV());
  }

  load(value: CV): void {
    this.cv.set(value);
  }

  exportJson(): string {
    return JSON.stringify(this.cv(), null, 2);
  }

  importJson(json: string): { ok: true } | { ok: false; error: string } {
    try {
      const parsed = cvSchema.safeParse(JSON.parse(json));
      if (!parsed.success) {
        return { ok: false, error: parsed.error.issues.map((i) => i.message).join('; ') };
      }
      this.cv.set(parsed.data);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : 'Invalid JSON' };
    }
  }
}
