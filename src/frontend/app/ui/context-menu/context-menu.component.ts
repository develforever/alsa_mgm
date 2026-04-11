import { Component, inject, ViewChild, TemplateRef } from '@angular/core';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { ContextMenuAction } from './models/action.model';
import { ContextMenuContext, ContextMenuPosition } from './models/context.model';
import { ContextMenuServiceImpl } from './context-menu.service';
import { UserMenuPreferenceService } from './user-menu-preference.service';

@Component({
    selector: 'app-context-menu',
    standalone: true,
    imports: [
        CommonModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule
    ],
    template: `
        <ng-template #menuTemplate>
            <mat-menu #menu="matMenu" [xPosition]="position.x" [yPosition]="position.y">
                <ng-container *ngFor="let action of visibleActions; let last = last">
                    <ng-container *ngIf="!action.separator">
                        <button mat-menu-item 
                                [disabled]="isActionDisabled(action)"
                                (click)="executeAction(action)">
                            <mat-icon *ngIf="action.icon">{{ action.icon }}</mat-icon>
                            <span>{{ action.label }}</span>
                        </button>
                    </ng-container>
                    <mat-divider *ngIf="action.separator && !last"></mat-divider>
                </ng-container>
                
                <ng-container *ngIf="hiddenActions.length > 0">
                    <mat-divider></mat-divider>
                    <button mat-menu-item (click)="toggleMoreMenu()">
                        <mat-icon>more_horiz</mat-icon>
                        <span>Więcej</span>
                    </button>
                </ng-container>
            </mat-menu>
            
            <mat-menu #moreMenu="matMenu">
                <ng-container *ngFor="let action of hiddenActions">
                    <ng-container *ngIf="!action.separator">
                        <button mat-menu-item 
                                [disabled]="isActionDisabled(action)"
                                (click)="executeAction(action)">
                            <mat-icon *ngIf="action.icon">{{ action.icon }}</mat-icon>
                            <span>{{ action.label }}</span>
                        </button>
                    </ng-container>
                    <mat-divider *ngIf="action.separator"></mat-divider>
                </ng-container>
            </mat-menu>
        </ng-template>
    `
})
export class ContextMenuComponent {
    @ViewChild('menuTemplate') menuTemplate!: TemplateRef<unknown>;
    @ViewChild('menu') menu!: MatMenuTrigger;
    @ViewChild('moreMenu') moreMenu!: MatMenuTrigger;

    private contextMenuService = inject(ContextMenuServiceImpl);
    private userMenuPreferenceService = inject(UserMenuPreferenceService);

    context: ContextMenuContext | null = null;
    position: ContextMenuPosition = { x: 'after', y: 'below' };
    visibleActions: ContextMenuAction[] = [];
    hiddenActions: ContextMenuAction[] = [];
    maxVisibleActions = 5;

    open(context: ContextMenuContext, position: ContextMenuPosition): void {
        this.context = context;
        this.position = position;
        
        const allActions = this.contextMenuService.getActionsForContext(context);
        const userPreferences = this.userMenuPreferenceService.getVisibleActions(context.type);
        
        if (userPreferences && userPreferences.length > 0) {
            this.visibleActions = allActions.filter(action => userPreferences.includes(action.id));
            this.hiddenActions = allActions.filter(action => !userPreferences.includes(action.id));
        } else {
            this.visibleActions = allActions.slice(0, this.maxVisibleActions);
            this.hiddenActions = allActions.slice(this.maxVisibleActions);
        }

        // Trigger menu open
        if (this.menu) {
            this.menu.openMenu();
        }
    }

    close(): void {
        if (this.menu) {
            this.menu.closeMenu();
        }
        if (this.moreMenu) {
            this.moreMenu.closeMenu();
        }
    }

    executeAction(action: ContextMenuAction): void {
        if (!this.isActionDisabled(action) && action.handler && this.context) {
            action.handler(this.context);
        }
    }

    isActionDisabled(action: ContextMenuAction): boolean {
        return action.disabled && this.context ? action.disabled(this.context) : false;
    }

    toggleMoreMenu(): void {
        if (this.moreMenu) {
            this.moreMenu.openMenu();
        }
    }
}
