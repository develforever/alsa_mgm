export interface UserMenuPreference {
    userId: string;
    contextTypePreferences: Record<string, ContextTypePreference>;
}

export interface ContextTypePreference {
    visibleActions: string[];
    customMenus: CustomMenu[];
}

export interface CustomMenu {
    id: string;
    name: string;
    actionIds: string[];
}
