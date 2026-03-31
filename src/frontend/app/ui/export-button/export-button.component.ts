import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CsvService, CsvExportOptions } from '../../services/export/csv.service';

export interface ExportableColumn<T = unknown> {
  key: string;
  header: string;
  getter: (item: T) => string | number | boolean | null | undefined;
}

@Component({
  selector: 'app-export-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu" matTooltip="Eksportuj">
      <mat-icon>file_download</mat-icon>
    </button>
    <mat-menu #menu="matMenu">
      <button mat-menu-item (click)="exportToCsv()">
        <mat-icon>table</mat-icon>
        <span>Eksportuj do CSV</span>
      </button>
    </mat-menu>
  `
})
export class ExportButtonComponent<T> {
  private csvService = inject(CsvService);

  @Input() data: T[] = [];
  @Input() columns: ExportableColumn<T>[] = [];
  @Input() filename = 'export.csv';

  exportToCsv(): void {
    if (!this.data.length || !this.columns.length) {
      return;
    }

    const headers = this.columns.map(col => col.header);
    const rows = this.data.map(item => 
      this.columns.map(col => col.getter(item))
    );

    const options: CsvExportOptions = {
      filename: this.filename,
      headers,
      rows
    };

    this.csvService.exportToCsv(options);
  }
}
