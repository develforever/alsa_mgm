import { Component, HostListener, inject, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ContextMenuAction } from './models/action.model';
import { ContextMenuContext } from './models/context.model';
import { ContextMenuTriggerService } from './context-menu-trigger.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-simple-context-menu',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule
    ],
    template: `
        <div class="context-menu-overlay" *ngIf="isOpen" (click)="close()">
            <div class="context-menu" [style.left.px]="x" [style.top.px]="y" (click)="$event.stopPropagation()">
                @for (action of visibleActions; track $index) {
                    @if (!action.separator) {
                        <button mat-menu-item 
                                [disabled]="isActionDisabled(action)"
                                (click)="executeAction(action)">
                            @if (action.icon) {
                                <mat-icon>{{ action.icon }}</mat-icon>
                            }
                            <span>{{ action.label }}</span>
                        </button>
                    }
                    @if (action.separator) {
                        <mat-divider></mat-divider>
                    }
                }
                
                @if (hiddenActions.length > 0) {
                    <mat-divider></mat-divider>
                    <button mat-menu-item (click)="showMore = !showMore">
                        <mat-icon>more_horiz</mat-icon>
                        <span>Więcej</span>
                    </button>
                    
                    @if (showMore) {
                        @for (action of hiddenActions; track $index) {
                            @if (!action.separator) {
                                <button mat-menu-item 
                                        [disabled]="isActionDisabled(action)"
                                        (click)="executeAction(action)">
                                    @if (action.icon) {
                                        <mat-icon>{{ action.icon }}</mat-icon>
                                    }
                                    <span>{{ action.label }}</span>
                                </button>
                            }
                            @if (action.separator) {
                                <mat-divider></mat-divider>
                            }
                        }
                    }
                }
            </div>
        </div>
    `,
    styles: [`
        .context-menu-overlay {
            position: fixed !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 99999 !important;
            pointer-events: auto !important;
            background: transparent;
        }
        
        .context-menu {
            position: fixed !important;
            min-width: 200px;
            background: white;
            border-radius: 4px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
            padding: 4px 0;
            pointer-events: auto;
            border: 1px solid #e0e0e0;
        }
        
        .context-menu button {
            width: 100%;
            text-align: left;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 0;
            min-height: 40px;
        }
        
        .context-menu button:hover {
            background-color: #f5f5f5;
        }
        
        .context-menu mat-divider {
            margin: 4px 0;
        }
    `]
})
export class SimpleContextMenuComponent implements OnDestroy {
    private triggerService = inject(ContextMenuTriggerService);
    private ngZone = inject(NgZone);
    private subscription: Subscription | null = null;
    
    isOpen = false;
    x = 0;
    y = 0;
    context: ContextMenuContext | null = null;
    visibleActions: ContextMenuAction[] = [];
    hiddenActions: ContextMenuAction[] = [];
    showMore = false;
    maxVisibleActions = 5;

    constructor() {
        this.subscription = this.triggerService.getTriggerData$().subscribe(triggerData => {
            this.ngZone.run(() => {
                if (triggerData) {
                    this.open(triggerData.context, triggerData.position, triggerData.actions);
                } else {
                    // Only close locally, don't call triggerService.close() to avoid infinite loop
                    this.isOpen = false;
                    this.showMore = false;
                }
            });
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    open(context: ContextMenuContext, position: { x: number; y: number }, actions: ContextMenuAction[]): void {
        this.context = context;
        this.x = position.x;
        this.y = position.y;
        
        // Use provided actions directly
        this.visibleActions = actions.slice(0, this.maxVisibleActions);
        this.hiddenActions = actions.slice(this.maxVisibleActions);
        
        this.showMore = false;
        this.isOpen = true;
    }

    close(): void {
        this.isOpen = false;
        this.showMore = false;
        // Don't call triggerService.close() to avoid infinite loop
        // The subscription handles state changes when trigger data is null
    }

    executeAction(action: ContextMenuAction): void {
        if (!this.isActionDisabled(action) && action.handler && this.context) {
            action.handler(this.context);
        }
        this.close();
    }

    isActionDisabled(action: ContextMenuAction): boolean {
        return action.disabled && this.context ? action.disabled(this.context) : false;
    }

    @HostListener('document:click')
    @HostListener('document:contextmenu')
    onDocumentClick(): void {
        if (this.isOpen) {
            this.close();
        }
    }
}
