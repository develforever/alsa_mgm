import { Injectable, signal, computed, inject } from '@angular/core';
import { ContextMenuProvider, ContextMenuService } from './context-menu-config.interface';
import { ContextMenuAction, ContextMenuActionMetadata } from './models/action.model';
import { ContextMenuContext } from './models/context.model';
import { UserMenuPreferenceService } from './user-menu-preference.service';

@Injectable({ providedIn: 'root' })
export class ContextMenuServiceImpl implements ContextMenuService {
    private providers = signal<Map<string, ContextMenuProvider>>(new Map());
    private actionsMetadata = signal<Map<string, ContextMenuActionMetadata>>(new Map());
    
    private userMenuPreferenceService = inject(UserMenuPreferenceService);
    
    registeredProviders = computed(() => Array.from(this.providers().values()));
    actionsByProvider = computed(() => {
        const map = new Map<string, ContextMenuAction[]>();
        this.providers().forEach((provider, providerId) => {
            const actions = this.getAllActionsFromProvider(provider);
            map.set(providerId, actions);
        });
        return map;
    });

    registerProvider(provider: ContextMenuProvider): void {
        const providerId = provider.getProviderId();
        if (this.providers().has(providerId)) {
            this.unregisterProvider(providerId);
        }
        
        const newProviders = new Map(this.providers());
        newProviders.set(providerId, provider);
        this.providers.set(newProviders);
        
        // Register actions with metadata
        const actions = provider.getContextMenuActions({ element: document.createElement('div'), type: 'dummy' });
        const newMetadata = new Map(this.actionsMetadata());
        actions.forEach(action => {
            newMetadata.set(action.id, {
                action,
                providerId,
                providerName: provider.getProviderName(),
                registeredAt: new Date()
            });
        });
        this.actionsMetadata.set(newMetadata);
    }

    unregisterProvider(providerId: string): void {
        const newProviders = new Map(this.providers());
        const provider = newProviders.get(providerId);
        
        if (provider) {
            // Remove actions metadata
            const actions = provider.getContextMenuActions({ element: document.createElement('div'), type: 'dummy' });
            const newMetadata = new Map(this.actionsMetadata());
            actions.forEach(action => {
                newMetadata.delete(action.id);
            });
            this.actionsMetadata.set(newMetadata);
            
            newProviders.delete(providerId);
            this.providers.set(newProviders);
        }
    }

    getActionsForContext(context: ContextMenuContext): ContextMenuAction[] {
        const allActions: ContextMenuAction[] = [];
        
        this.providers().forEach(provider => {
            const supportedTypes = provider.getSupportedContextTypes();
            if (supportedTypes.includes(context.type) || supportedTypes.includes('*')) {
                const actions = provider.getContextMenuActions(context);
                allActions.push(...actions);
            }
        });
        
        // Filter actions based on visibility and user preferences
        const visibleActions = allActions.filter(action => {
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

    getRegisteredProviders(): ContextMenuProvider[] {
        return this.registeredProviders();
    }

    getActionsByProvider(): Map<string, ContextMenuAction[]> {
        return this.actionsByProvider();
    }

    getActionMetadata(actionId: string): ContextMenuActionMetadata | undefined {
        return this.actionsMetadata().get(actionId);
    }

    private getAllActionsFromProvider(provider: ContextMenuProvider): ContextMenuAction[] {
        return provider.getContextMenuActions({ element: document.createElement('div'), type: 'dummy' });
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
        
        // Sort preferred actions by their order in preferences
        preferred.sort((a, b) => {
            const indexA = preferredActionIds.indexOf(a.id);
            const indexB = preferredActionIds.indexOf(b.id);
            return indexA - indexB;
        });
        
        return [...preferred, ...others];
    }
}
