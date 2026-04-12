import { Injectable, inject, signal } from '@angular/core';
import { ContextMenuService, CONTEXT_MENU_REGISTRY, ContextMenuActionEvent } from './context-menu-config.interface';
import { ContextMenuAction, ContextMenuActionMetadata } from './models/action.model';
import { ContextMenuContext } from './models/context.model';
import { UserMenuPreferenceService } from './user-menu-preference.service';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContextMenuServiceImpl implements ContextMenuService {
    // Static actions collected from DI token at startup
    private readonly contributions = inject(CONTEXT_MENU_REGISTRY, { optional: true }) ?? [];
    private allActions: ContextMenuAction[] = this.contributions.flat();

    // Action metadata map
    private actionsMetadata = new Map<string, ContextMenuActionMetadata>();

    // Action execution bus - components subscribe to handle their actions
    private actionBus$ = new Subject<ContextMenuActionEvent>();

    // Signals for reactive UI
    private actionsSignal = signal<ContextMenuAction[]>(this.allActions);

    private userMenuPreferenceService = inject(UserMenuPreferenceService);

    constructor() {
        // Build metadata from all static actions
        this.allActions.forEach(action => {
            this.actionsMetadata.set(action.id, {
                action,
                category: action.category || action.contextType,
                registeredAt: new Date()
            });
        });
    }

    registerActions(actions: ContextMenuAction[]): void {
        actions.forEach(action => {
            if (this.actionsMetadata.has(action.id)) return;
            this.allActions.push(action);
            this.actionsMetadata.set(action.id, {
                action,
                category: action.category || action.contextType,
                registeredAt: new Date()
            });
        });
        this.actionsSignal.set([...this.allActions]);
    }

    unregisterActions(actionIds: string[]): void {
        this.allActions = this.allActions.filter(a => !actionIds.includes(a.id));
        actionIds.forEach(id => this.actionsMetadata.delete(id));
        this.actionsSignal.set([...this.allActions]);
    }

    getActionsForContext(context: ContextMenuContext): ContextMenuAction[] {
        // Filter actions by context type
        const matchingActions = this.allActions.filter(action =>
            action.contextType === context.type || action.contextType === '*'
        );

        // Filter by visibility
        const visibleActions = matchingActions.filter(action => {
            if (action.visible && !action.visible(context)) {
                return false;
            }
            return true;
        });

        // Apply user preferences
        const userPreferences = this.userMenuPreferenceService.getVisibleActions(context.type);
        if (userPreferences && userPreferences.length > 0) {
            return this.sortActionsByPreference(visibleActions, userPreferences as string[]);
        }

        return visibleActions;
    }

    executeAction(actionId: string, context: ContextMenuContext): void {
        // Check if action has a static handler
        const action = this.allActions.find(a => a.id === actionId);
        if (action?.handler) {
            action.handler(context);
        }

        // Always emit on the bus so live components can handle it
        this.actionBus$.next({ actionId, context });
    }

    getActionBus() {
        return this.actionBus$.asObservable();
    }

    getAllActions(): ContextMenuAction[] {
        return this.actionsSignal();
    }

    getActionsByCategory(category: string): ContextMenuAction[] {
        return this.allActions.filter(a => a.category === category || a.contextType === category);
    }

    getActionMetadata(actionId: string): ContextMenuActionMetadata | undefined {
        return this.actionsMetadata.get(actionId);
    }

    getActionsSignal() {
        return this.actionsSignal.asReadonly();
    }

    private sortActionsByPreference(actions: ContextMenuAction[], preferredActionIds: string[]): ContextMenuAction[] {
        const preferred: ContextMenuAction[] = [];
        const others: ContextMenuAction[] = [];

        actions.forEach(action => {
            if (preferredActionIds.includes(action.id)) {
                preferred.push(action);
            } else {
                others.push(action);
            }
        });

        preferred.sort((a, b) => {
            const indexA = preferredActionIds.indexOf(a.id);
            const indexB = preferredActionIds.indexOf(b.id);
            return indexA - indexB;
        });

        return [...preferred, ...others];
    }
}
