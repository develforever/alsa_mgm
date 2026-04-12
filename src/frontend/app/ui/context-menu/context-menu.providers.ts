import { CONTEXT_MENU_REGISTRY } from './context-menu-config.interface';

// Global context menu registry token provider (empty by default)
// Feature modules register their actions via CONTEXT_MENU_REGISTRY with multi: true
// in app.config.ts or their own providers array
export const CONTEXT_MENU_ROOT_PROVIDER = {
    provide: CONTEXT_MENU_REGISTRY,
    useValue: [],
    multi: true
};
