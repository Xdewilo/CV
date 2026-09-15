import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type { CV } from '@ats-cv/schema';

@Injectable({ providedIn: 'root' })
export class PdfService {
  private readonly http = inject(HttpClient);

  async download(cv: CV): Promise<void> {
    const blob = await firstValueFrom(
      this.http.post('/api/export-pdf', cv, { responseType: 'blob' }),
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safe = (cv.personal.fullName || 'cv').replace(/[^\w\-]+/g, '_');
    a.href = url;
    a.download = `${safe}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
}
