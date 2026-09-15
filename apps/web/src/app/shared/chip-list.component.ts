import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chip-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-wrap gap-2 mb-2">
      @for (item of items; track $index) {
        <span class="chip">
          {{ item }}
          <button type="button" class="text-ink-500 hover:text-red-600" (click)="remove($index)">×</button>
        </span>
      }
      @if (!items.length) {
        <span class="text-xs text-ink-500 italic">{{ emptyMessage }}</span>
      }
    </div>
    <div class="flex gap-2">
      <input
        class="rounded-md border border-ink-300 bg-white px-3 py-2 flex-1 text-sm focus:border-accent-500 outline-none"
        [(ngModel)]="draft"
        (keydown.enter)="add($event)"
        [placeholder]="placeholder"
      />
      <button type="button" class="btn-ghost" (click)="add()">Agregar</button>
    </div>
  `,
})
export class ChipListComponent {
  @Input({ required: true }) items: string[] = [];
  @Input() placeholder = 'Escribe y presiona Enter';
  @Input() emptyMessage = 'Sin elementos aún';
  @Output() readonly itemsChange = new EventEmitter<string[]>();

  draft = '';

  add(ev?: Event): void {
    ev?.preventDefault();
    const value = this.draft.trim();
    if (!value) return;
    this.itemsChange.emit([...this.items, value]);
    this.draft = '';
  }

  remove(index: number): void {
    this.itemsChange.emit(this.items.filter((_, i) => i !== index));
  }
}
