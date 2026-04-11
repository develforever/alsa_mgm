import { ContextMenuAction } from './models/action.model';
import { ContextMenuContext } from './models/context.model';

export interface ContextMenuProvider {
    getContextMenuActions(context: ContextMenuContext): ContextMenuAction[];
    getProviderId(): string;
    getProviderName(): string;
    getSupportedContextTypes(): string[];
}

export interface ContextMenuService {
    registerProvider(provider: ContextMenuProvider): void;
    unregisterProvider(providerId: string): void;
    getActionsForContext(context: ContextMenuContext): ContextMenuAction[];
    getRegisteredProviders(): ContextMenuProvider[];
    getActionsByProvider(): Map<string, ContextMenuAction[]>;
}

export type { ContextMenuAction, ContextMenuContext };
