import { Injectable, inject } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root'
})
export class PaginatorIntlService extends MatPaginatorIntl {
  private transloco = inject(TranslocoService);

  constructor() {
    super();

    this.transloco.langChanges$.subscribe(() => {
      this.getTranslations();
    });
    
    this.getTranslations();
  }

  private getTranslations() {
    this.itemsPerPageLabel = this.transloco.translate('PAGINATOR.ITEMS_PER_PAGE');
    this.nextPageLabel = this.transloco.translate('PAGINATOR.NEXT_PAGE');
    this.previousPageLabel = this.transloco.translate('PAGINATOR.PREVIOUS_PAGE');
    this.firstPageLabel = this.transloco.translate('PAGINATOR.FIRST_PAGE');
    this.lastPageLabel = this.transloco.translate('PAGINATOR.LAST_PAGE');
    this.changes.next();
  }

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return this.transloco.translate('PAGINATOR.RANGE_LABEL', { start: 0, end: 0, length });
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return this.transloco.translate('PAGINATOR.RANGE_LABEL', { 
        start: startIndex + 1, 
        end: endIndex, 
        length 
    });
  };
}
