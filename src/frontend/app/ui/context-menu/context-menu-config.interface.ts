import { InjectionToken } from '@angular/core';
import { ContextMenuAction, ContextMenuActionMetadata } from './models/action.model';
import { ContextMenuContext } from './models/context.model';

/** Token for static action definitions - registered at app root via multi: true */
export const CONTEXT_MENU_REGISTRY = new InjectionToken<ContextMenuAction[]>('ContextMenuRegistry');

/** Event emitted when an action is executed via the service bus */
export interface ContextMenuActionEvent {
    actionId: string;
    context: ContextMenuContext;
}

export interface ContextMenuService {
    /** Get all actions available for a given context type */
    getActionsForContext(context: ContextMenuContext): ContextMenuAction[];
    /** Execute an action by ID - emits on the action execution bus */
    executeAction(actionId: string, context: ContextMenuContext): void;
    /** Subscribe to action execution events (components handle their actions here) */
    getActionBus(): import('rxjs').Observable<ContextMenuActionEvent>;
    /** Register actions dynamically (e.g. from component lifecycle) */
    registerActions(actions: ContextMenuAction[]): void;
    /** Unregister actions by IDs */
    unregisterActions(actionIds: string[]): void;
    /** Get all registered actions */
    getAllActions(): ContextMenuAction[];
    /** Get actions by category */
    getActionsByCategory(category: string): ContextMenuAction[];
    /** Get action metadata */
    getActionMetadata(actionId: string): ContextMenuActionMetadata | undefined;
}

export type { ContextMenuAction, ContextMenuContext };
