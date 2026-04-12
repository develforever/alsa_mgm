import { Component, inject, NgZone, OnDestroy, ViewContainerRef, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ContextMenuAction } from './models/action.model';
import { ContextMenuContext } from './models/context.model';
import { ContextMenuTriggerService } from './context-menu-trigger.service';
import { ContextMenuServiceImpl } from './context-menu.service';
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
        <ng-template #menuTemplate>
            <div class="context-menu" (click)="$event.stopPropagation()">
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
        </ng-template>
    `,
    styles: [`
        .context-menu {
            min-width: 200px;
            background: white;
            border-radius: 4px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
            padding: 4px 0;
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
    private contextMenuService = inject(ContextMenuServiceImpl);
    private ngZone = inject(NgZone);
    private overlay = inject(Overlay);
    private viewContainerRef = inject(ViewContainerRef);
    private subscription: Subscription | null = null;
    private overlayRef: OverlayRef | null = null;
    
    @ViewChild('menuTemplate') menuTemplate!: TemplateRef<unknown>;
    
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
                    this.close();
                }
            });
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.close();
    }

    open(context: ContextMenuContext, position: { x: number; y: number }, actions: ContextMenuAction[]): void {
        this.close();
        
        this.context = context;
        this.visibleActions = actions.slice(0, this.maxVisibleActions);
        this.hiddenActions = actions.slice(this.maxVisibleActions);
        this.showMore = false;

        const positionStrategy = this.overlay.position()
            .flexibleConnectedTo({ x: position.x, y: position.y })
            .withPositions([{
                originX: 'start',
                originY: 'bottom',
                overlayX: 'start',
                overlayY: 'top'
            }, {
                originX: 'end',
                originY: 'bottom',
                overlayX: 'end',
                overlayY: 'top'
            }, {
                originX: 'start',
                originY: 'top',
                overlayX: 'start',
                overlayY: 'bottom'
            }]);

        this.overlayRef = this.overlay.create({
            positionStrategy,
            hasBackdrop: true,
            backdropClass: 'cdk-overlay-transparent-backdrop',
            scrollStrategy: this.overlay.scrollStrategies.close()
        });

        const portal = new TemplatePortal(this.menuTemplate, this.viewContainerRef);
        this.overlayRef.attach(portal);

        this.overlayRef.backdropClick().subscribe(() => this.close());
        this.overlayRef.keydownEvents().subscribe(event => {
            if (event.key === 'Escape') {
                this.close();
            }
        });
    }

    close(): void {
        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = null;
        }
        this.showMore = false;
    }

    executeAction(action: ContextMenuAction): void {
        if (!this.isActionDisabled(action) && this.context) {
            this.contextMenuService.executeAction(action.id, this.context);
        }
        this.close();
    }

    isActionDisabled(action: ContextMenuAction): boolean {
        return action.disabled && this.context ? action.disabled(this.context) : false;
    }
}
