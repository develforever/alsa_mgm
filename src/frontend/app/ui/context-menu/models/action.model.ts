import { ContextMenuContext } from './context.model';

export interface ContextMenuAction {
    id: string;
    label: string;
    icon?: string;
    handler: (context: ContextMenuContext) => void | Promise<void>;
    category?: string;
    contextType: string;
    disabled?: (context: ContextMenuContext) => boolean;
    visible?: (context: ContextMenuContext) => boolean;
    separator?: boolean;
}

export interface ContextMenuActionMetadata {
    action: ContextMenuAction;
    providerId: string;
    providerName: string;
    registeredAt: Date;
}
