import { Provider } from '@angular/core';
import { CONTEXT_MENU_REGISTRY } from '../../../../ui/context-menu/context-menu-config.interface';
import { ContextMenuAction } from '../../../../ui/context-menu/models/action.model';

const auditLogActions: ContextMenuAction[] = [
    {
        id: 'view-json',
        label: 'Podgląd JSON',
        icon: 'code',
        contextType: 'audit-log-row',
        category: 'audit-log'
    },
    {
        id: 'copy-details',
        label: 'Kopiuj szczegóły',
        icon: 'content_copy',
        contextType: 'audit-log-row',
        category: 'audit-log',
        handler: (ctx) => {
            const row = ctx.data as Record<string, unknown> | undefined;
            if (!row) return;
            const details = JSON.stringify(row, null, 2);
            navigator.clipboard.writeText(details);
        }
    }
];

export const provideAuditLogMenu: () => Provider = () => {
    return {
        provide: CONTEXT_MENU_REGISTRY,
        useValue: auditLogActions,
        multi: true
    };
};
