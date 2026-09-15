export const DRAFT_KEY = 'ats-cv-draft';

export class StorageService {
  private timer: ReturnType<typeof setTimeout> | null = null;

  read<T>(key: string): T | null {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  write<T>(key: string, value: T): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(key);
  }

  saveDebounced<T>(key: string, value: T, delay = 400): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.write(key, value), delay);
  }
}
