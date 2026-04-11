import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ContextMenuAction } from './models/action.model';
import { UserMenuPreferenceService } from './user-menu-preference.service';

export interface ContextMenuDialogData {
    contextType: string;
    availableActions: ContextMenuAction[];
    currentVisibleActions: string[];
}

@Component({
    selector: 'app-context-menu-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
        DragDropModule
    ],
    template: `
        <h2 mat-dialog-title>Konfiguruj menu kontekstowe</h2>
        <mat-dialog-content>
            <p class="context-type">Typ kontekstu: <strong>{{ data.contextType }}</strong></p>
            
            <div class="actions-list" cdkDropList (cdkDropListDropped)="drop($event)">
                <div class="action-item" 
                     *ngFor="let action of sortedActions" 
                     cdkDrag>
                    <mat-icon cdkDragHandle class="drag-handle">drag_indicator</mat-icon>
                    <mat-checkbox 
                        [checked]="isActionVisible(action.id)"
                        (change)="toggleActionVisibility(action.id, $event.checked)">
                        <div class="action-content">
                            <mat-icon *ngIf="action.icon">{{ action.icon }}</mat-icon>
                            <span>{{ action.label }}</span>
                        </div>
                    </mat-checkbox>
                </div>
            </div>
            
            <div class="info-text">
                <mat-icon class="info-icon">info</mat-icon>
                <span>Przeciągnij elementy, aby zmienić kolejność. Odznacz, aby ukryć akcję w menu głównym.</span>
            </div>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-button (click)="onCancel()">Anuluj</button>
            <button mat-raised-button color="primary" (click)="onSave()">Zapisz</button>
        </mat-dialog-actions>
    `,
    styles: [`
        .context-type {
            margin-bottom: 16px;
            color: rgba(0, 0, 0, 0.6);
        }
        
        .actions-list {
            max-height: 400px;
            overflow-y: auto;
            border: 1px solid rgba(0, 0, 0, 0.12);
            border-radius: 4px;
            padding: 8px;
        }
        
        .action-item {
            display: flex;
            align-items: center;
            padding: 8px;
            margin-bottom: 4px;
            background: white;
            border-radius: 4px;
            cursor: move;
        }
        
        .action-item:hover {
            background: rgba(0, 0, 0, 0.04);
        }
        
        .drag-handle {
            margin-right: 8px;
            cursor: move;
            color: rgba(0, 0, 0, 0.54);
        }
        
        .action-content {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .info-text {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin-top: 16px;
            padding: 12px;
            background: rgba(0, 0, 0, 0.04);
            border-radius: 4px;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.6);
        }
        
        .info-icon {
            flex-shrink: 0;
            font-size: 18px;
        }
    `]
})
export class ContextMenuDialogComponent {
    private dialogRef = inject(MatDialogRef<ContextMenuDialogComponent>);
    private userMenuPreferenceService = inject(UserMenuPreferenceService);
    
    data = inject<ContextMenuDialogData>(MAT_DIALOG_DATA);
    
    visibleActionIds: string[] = [];

    constructor() {
        this.visibleActionIds = [...this.data.currentVisibleActions];
    }

    get sortedActions(): ContextMenuAction[] {
        const visible = this.data.availableActions.filter(a => this.visibleActionIds.includes(a.id));
        const hidden = this.data.availableActions.filter(a => !this.visibleActionIds.includes(a.id));
        
        // Sort visible actions by their order in visibleActionIds
        visible.sort((a, b) => {
            const indexA = this.visibleActionIds.indexOf(a.id);
            const indexB = this.visibleActionIds.indexOf(b.id);
            return indexA - indexB;
        });
        
        return [...visible, ...hidden];
    }

    isActionVisible(actionId: string): boolean {
        return this.visibleActionIds.includes(actionId);
    }

    toggleActionVisibility(actionId: string, checked: boolean): void {
        if (checked) {
            if (!this.visibleActionIds.includes(actionId)) {
                this.visibleActionIds.push(actionId);
            }
        } else {
            this.visibleActionIds = this.visibleActionIds.filter(id => id !== actionId);
        }
    }

    drop(event: CdkDragDrop<ContextMenuAction[]>): void {
        const visibleActions = this.sortedActions.filter(a => this.visibleActionIds.includes(a.id));
        moveItemInArray(visibleActions, event.previousIndex, event.currentIndex);
        this.visibleActionIds = visibleActions.map(a => a.id);
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        this.userMenuPreferenceService.setVisibleActions(this.data.contextType, this.visibleActionIds);
        this.dialogRef.close(this.visibleActionIds);
    }
}
