import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-widget-settings-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule
  ],
  template: `
    <h2 mat-dialog-title>Konfiguracja widżetu</h2>
    <mat-dialog-content>
      <div class="dialog-content">
        <p>Edytuj konfigurację widżetu w formacie JSON:</p>
        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Konfiguracja (JSON)</mat-label>
          <textarea matInput rows="10" [(ngModel)]="jsonConfig" (ngModelChange)="onConfigChange()"></textarea>
          <mat-error *ngIf="error()">Nieprawidłowy format JSON</mat-error>
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Anuluj</button>
      <button mat-flat-button color="primary" [disabled]="error()" (click)="onSave()">Zapisz</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; }
    .dialog-content { padding-top: 10px; }
    textarea { font-family: monospace; font-size: 13px; }
  `]
})
export class WidgetSettingsDialogComponent {
  public dialogRef = inject(MatDialogRef<WidgetSettingsDialogComponent>);
  public data = inject<{ config: Record<string, unknown> | null }>(MAT_DIALOG_DATA);

  jsonConfig: string;
  error = signal<boolean>(false);

  constructor() {
    this.jsonConfig = JSON.stringify(this.data.config || {}, null, 2);
  }

  onConfigChange() {
    try {
      JSON.parse(this.jsonConfig);
      this.error.set(false);
    } catch {
      this.error.set(true);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (!this.error()) {
      try {
        const parsed = JSON.parse(this.jsonConfig);
        this.dialogRef.close(parsed);
      } catch {
        this.error.set(true);
      }
    }
  }
}
