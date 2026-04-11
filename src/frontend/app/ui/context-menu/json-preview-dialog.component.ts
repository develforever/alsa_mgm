import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export interface JsonPreviewDialogData {
    title: string;
    data: unknown;
}

@Component({
    selector: 'app-json-preview-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule
    ],
    template: `
        <h2 mat-dialog-title>
            <mat-icon>code</mat-icon>
            {{ data.title }}
        </h2>
        <mat-dialog-content>
            <pre class="json-preview">{{ formattedJson }}</pre>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-button (click)="copyToClipboard()">
                <mat-icon>content_copy</mat-icon>
                Kopiuj
            </button>
            <button mat-button (click)="close()">
                Zamknij
            </button>
        </mat-dialog-actions>
    `,
    styles: [`
        :host {
            display: block;
        }
        
        h2 {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .json-preview {
            background: #f5f5f5;
            padding: 16px;
            border-radius: 4px;
            overflow-x: auto;
            max-height: 500px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.5;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
    `]
})
export class JsonPreviewDialogComponent {
    data = inject<JsonPreviewDialogData>(MAT_DIALOG_DATA);
    private dialogRef = inject(MatDialogRef<JsonPreviewDialogComponent>);

    get formattedJson(): string {
        return JSON.stringify(this.data.data, null, 2);
    }

    copyToClipboard(): void {
        navigator.clipboard.writeText(this.formattedJson).then(() => {
            // Could show a snackbar here
        });
    }

    close(): void {
        this.dialogRef.close();
    }
}
