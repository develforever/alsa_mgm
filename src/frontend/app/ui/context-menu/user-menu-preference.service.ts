import { Injectable, signal } from '@angular/core';
import { UserMenuPreference, ContextTypePreference } from './models/user-preference.model';

const LOCAL_STORAGE_KEY = 'contextMenuPreferences';

@Injectable({ providedIn: 'root' })
export class UserMenuPreferenceService {
    private preferences = signal<UserMenuPreference | null>(null);

    constructor() {
        this.loadPreferences();
    }

    getVisibleActions(contextType: string): string[] | null {
        const pref = this.preferences();
        if (!pref) return null;
        
        const contextPref = pref.contextTypePreferences[contextType];
        return contextPref?.visibleActions || null;
    }

    setVisibleActions(contextType: string, actionIds: string[]): void {
        const currentPref = this.preferences() || this.createDefaultPreference();
        const contextPref: ContextTypePreference = {
            visibleActions: actionIds,
            customMenus: currentPref.contextTypePreferences[contextType]?.customMenus || []
        };
        
        const updatedPref: UserMenuPreference = {
            ...currentPref,
            contextTypePreferences: {
                ...currentPref.contextTypePreferences,
                [contextType]: contextPref
            }
        };
        
        this.preferences.set(updatedPref);
        this.savePreferences();
    }

    private createDefaultPreference(): UserMenuPreference {
        return {
            userId: 'default',
            contextTypePreferences: {}
        };
    }

    private loadPreferences(): void {
        try {
            const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (stored) {
                this.preferences.set(JSON.parse(stored));
            }
        } catch {
            // Silent error handling for localStorage access issues
        }
    }

    private savePreferences(): void {
        try {
            const pref = this.preferences();
            if (pref) {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pref));
            }
        } catch {
            // Silent error handling for localStorage access issues
        }
    }
}
